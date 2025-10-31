import { useEffect, useCallback } from 'react';
import { useMusic } from '../context/MusicContext';
import audioService from '../services/AudioService';

export const useAudioPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    currentTime, 
    duration, 
    queue, 
    currentIndex, 
    repeatMode, 
    isShuffled,
    dispatch 
  } = useMusic();

  // Initialize audio service
  useEffect(() => {
    const handleTimeUpdate = () => {
      const currentTime = audioService.getCurrentTime();
      const duration = audioService.getDuration();
      
      dispatch({ 
        type: 'SET_CURRENT_TIME', 
        payload: currentTime 
      });
      
      // Check if song is very close to ending (within 0.5 seconds)
      // This is a fallback in case the 'ended' event doesn't fire properly
      if (duration > 0 && (duration - currentTime) < 0.5 && !audioService.hasEnded()) {
        console.log('Song is nearly complete, checking for auto-advance...'); // Debug
        setTimeout(() => {
          if (audioService.hasEnded() || (audioService.getDuration() - audioService.getCurrentTime()) < 0.1) {
            console.log('Triggering manual advance due to near completion'); // Debug
            handleEnded();
          }
        }, 500);
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ 
        type: 'SET_DURATION', 
        payload: audioService.getDuration() 
      });
    };

    const handleEnded = () => {
      console.log('🎵 Song ended! Current:', currentSong?.title, 'Index:', currentIndex, 'Queue length:', queue.length);
      
      // Auto-advance to next song when current song ends
      if (repeatMode === 'one') {
        console.log('🔁 Repeating current song');
        audioService.setCurrentTime(0);
        audioService.play();
        return;
      }

      // Check if we have a queue and songs to advance to
      if (!queue || queue.length === 0) {
        console.log('❌ No queue available');
        dispatch({ type: 'SET_PLAYING', payload: false });
        return;
      }

      // Calculate next index
      let nextIndex = currentIndex + 1;
      
      if (isShuffled) {
        // Random next song
        const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
        if (availableIndices.length > 0) {
          nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          console.log('🔀 Shuffle mode: jumping to index', nextIndex);
        } else {
          console.log('❌ No more songs in shuffle mode');
          dispatch({ type: 'SET_PLAYING', payload: false });
          return;
        }
      } else {
        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0; // Loop back to first song
            console.log('🔄 Repeat all: looping back to first song');
          } else {
            console.log('⏹️ End of queue, stopping playback');
            dispatch({ type: 'SET_PLAYING', payload: false });
            return;
          }
        }
      }

      // Get the next song
      const nextSong = queue[nextIndex];
      if (nextSong) {
        console.log('⏭️ Advancing to:', nextSong.title, 'at index:', nextIndex);
        
        // Simple approach: just trigger the NEXT_SONG action
        dispatch({ type: 'NEXT_SONG' });
      } else {
        console.log('❌ No next song found at index:', nextIndex);
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    };

    // Handle system volume changes
    const handleVolumeChange = (newVolume) => {
      // Only update if the volume actually changed (to prevent infinite loops)
      if (Math.abs(newVolume - volume) > 0.01) {
        dispatch({ type: 'SET_VOLUME', payload: newVolume });
      }
    };

    audioService.init(handleTimeUpdate, handleLoadedMetadata, handleEnded, handleVolumeChange);
  }, [dispatch, currentIndex, isShuffled, queue, repeatMode, currentSong, volume]);

  // Update audio when current song changes
  useEffect(() => {
    if (currentSong) {
      console.log('Setting new song:', currentSong.title, 'at index:', currentIndex);
      audioService.setSrc(currentSong.audioUrl);
      
      if (isPlaying) {
        audioService.play().then(() => {
          console.log('Started playing:', currentSong.title);
        }).catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  }, [currentSong, isPlaying, currentIndex]);

  // Update volume
  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  const play = useCallback(async () => {
    if (currentSong) {
      const success = await audioService.play();
      if (success) {
        dispatch({ type: 'PLAY_PAUSE' });
      }
    }
  }, [currentSong, dispatch]);

  const pause = useCallback(() => {
    audioService.pause();
    dispatch({ type: 'PLAY_PAUSE' });
  }, [dispatch]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume) => {
    dispatch({ type: 'SET_VOLUME', payload: newVolume });
  }, [dispatch]);

  const seek = useCallback((time) => {
    audioService.setCurrentTime(time);
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  }, [dispatch]);

  const handleNext = useCallback(() => {
    if (repeatMode === 'one') {
      // Repeat current song
      audioService.setCurrentTime(0);
      audioService.play();
      return;
    }

    let nextIndex;
    
    if (isShuffled) {
      // Random next song
      const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length > 0) {
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        nextIndex = currentIndex; // Only one song in queue
      }
    } else {
      nextIndex = currentIndex + 1;
      
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0; // Loop back to first song
        } else {
          return; // End of queue
        }
      }
    }

    if (nextIndex < queue.length && queue[nextIndex]) {
      dispatch({
        type: 'SET_CURRENT_SONG',
        payload: queue[nextIndex]
      });
      dispatch({
        type: 'SET_QUEUE',
        payload: queue
      });
      // Update current index
      dispatch({
        type: 'NEXT_SONG'
      });
    }
  }, [currentIndex, queue, repeatMode, isShuffled, dispatch]);

  const handlePrevious = useCallback(() => {
    // If more than 3 seconds have passed, restart current song
    if (currentTime > 3) {
      audioService.setCurrentTime(0);
      return;
    }

    let prevIndex;
    
    if (isShuffled) {
      // Random previous song
      const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length > 0) {
        prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        prevIndex = currentIndex; // Only one song in queue
      }
    } else {
      prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = queue.length - 1; // Loop to last song
        } else {
          return; // Beginning of queue
        }
      }
    }

    if (prevIndex >= 0 && queue[prevIndex]) {
      dispatch({
        type: 'SET_CURRENT_SONG',
        payload: queue[prevIndex]
      });
      dispatch({
        type: 'PREVIOUS_SONG'
      });
    }
  }, [currentIndex, currentTime, queue, repeatMode, isShuffled, dispatch]);

  const playQueue = useCallback((songs, startIndex = 0) => {
    if (songs && songs.length > 0) {
      dispatch({ type: 'SET_QUEUE', payload: songs });
      dispatch({ 
        type: 'SET_CURRENT_SONG', 
        payload: songs[startIndex] 
      });
    }
  }, [dispatch]);

  const addToQueue = useCallback((song) => {
    const newQueue = [...queue, song];
    dispatch({ type: 'SET_QUEUE', payload: newQueue });
  }, [queue, dispatch]);

  const removeFromQueue = useCallback((index) => {
    const newQueue = queue.filter((_, i) => i !== index);
    dispatch({ type: 'SET_QUEUE', payload: newQueue });
    
    // Adjust current index if necessary
    if (index < currentIndex) {
      dispatch({ type: 'PREVIOUS_SONG' });
    } else if (index === currentIndex && newQueue.length > 0) {
      const newCurrentIndex = Math.min(currentIndex, newQueue.length - 1);
      dispatch({
        type: 'SET_CURRENT_SONG',
        payload: newQueue[newCurrentIndex]
      });
    }
  }, [queue, currentIndex, dispatch]);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, [dispatch]);

  const toggleRepeat = useCallback(() => {
    dispatch({ type: 'SET_REPEAT_MODE' });
  }, [dispatch]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Setup Media Session API for system integration
  useEffect(() => {
    if (currentSong && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album || 'Unknown Album',
        artwork: currentSong.coverUrl ? [
          { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ] : []
      });

      // Set action handlers for media keys and system controls
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
  }, [currentSong, play, pause, handleNext, handlePrevious]);

  return {
    // State
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    currentIndex,
    repeatMode,
    isShuffled,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    setVolume,
    seek,
    handleNext,
    handlePrevious,
    playQueue,
    addToQueue,
    removeFromQueue,
    toggleShuffle,
    toggleRepeat,
    
    // Utilities
    formatTime
  };
};
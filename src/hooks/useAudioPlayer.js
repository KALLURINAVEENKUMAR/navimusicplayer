import { useEffect, useCallback, useRef } from 'react';
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

  // Flag to prevent multiple auto-advance calls
  const autoAdvanceTriggered = useRef(false);

  // Create a stable handleEnded function
  const handleEnded = useCallback(() => {
    console.log('🎵 Song ended! Current:', currentSong?.title, 'Index:', currentIndex, 'Queue length:', queue?.length);
    
    // Reset the auto-advance flag
    autoAdvanceTriggered.current = false;
    
    // Auto-advance to next song when current song ends
    if (repeatMode === 'one') {
      console.log('🔁 Repeating current song');
      audioService.setCurrentTime(0);
      audioService.play();
      return;
    }

    // Check if we have a queue and songs to advance to
    if (!queue || queue.length === 0) {
      console.log('❌ No queue available for auto-advance');
      dispatch({ type: 'SET_PLAYING', payload: false });
      return;
    }

    if (queue.length === 1) {
      console.log('🔄 Only one song in queue');
      if (repeatMode === 'all') {
        console.log('🔁 Repeat all: restarting single song');
        audioService.setCurrentTime(0);
        audioService.play();
        return;
      } else {
        console.log('⏹️ Single song finished, stopping');
        dispatch({ type: 'SET_PLAYING', payload: false });
        return;
      }
    }

    // Calculate next index
    let nextIndex = currentIndex + 1;
    
    if (isShuffled) {
      // Random next song (excluding current)
      const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length > 0) {
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        console.log('🔀 Shuffle mode: jumping to random index', nextIndex);
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

    // Advance to next song
    if (nextIndex >= 0 && nextIndex < queue.length && queue[nextIndex]) {
      console.log('⏭️ Auto-advancing to:', queue[nextIndex].title, 'at index:', nextIndex);
      
      if (isShuffled || (nextIndex !== currentIndex + 1)) {
        // For shuffle or non-sequential moves, set song and index manually
        dispatch({
          type: 'SET_CURRENT_SONG',
          payload: queue[nextIndex]
        });
        dispatch({
          type: 'SET_CURRENT_INDEX',
          payload: nextIndex
        });
      } else {
        // For normal sequential advance, use NEXT_SONG action
        dispatch({ type: 'NEXT_SONG' });
      }
    } else {
      console.log('❌ No valid next song found');
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }, [currentSong, currentIndex, queue, repeatMode, isShuffled, dispatch]);

  // Initialize audio service
  useEffect(() => {
    let autoAdvanceTimeout = null;
    
    const handleTimeUpdate = () => {
      const currentTime = audioService.getCurrentTime();
      const duration = audioService.getDuration();
      
      dispatch({ 
        type: 'SET_CURRENT_TIME', 
        payload: currentTime 
      });
      
      // Clear any existing timeout
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
      }
      
      // Auto-advance detection when song is almost complete
      if (duration > 0 && currentTime > 0 && !autoAdvanceTriggered.current) {
        const timeRemaining = duration - currentTime;
        
        // Set timeout to trigger auto-advance
        if (timeRemaining <= 1 && timeRemaining > 0) {
          console.log('⏰ Setting auto-advance timeout. Time remaining:', timeRemaining);
          autoAdvanceTimeout = setTimeout(() => {
            if (!autoAdvanceTriggered.current) {
              console.log('⏰ Timeout auto-advance triggered');
              autoAdvanceTriggered.current = true;
              handleEnded();
            }
          }, (timeRemaining - 0.1) * 1000); // Trigger 0.1 seconds before end
        }
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ 
        type: 'SET_DURATION', 
        payload: audioService.getDuration() 
      });
    };

    const handleEndedEvent = (e) => {
      console.log('🎵 Audio ended event triggered');
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
      }
      if (!autoAdvanceTriggered.current) {
        autoAdvanceTriggered.current = true;
        handleEnded();
      }
    };

    // Handle system volume changes
    const handleVolumeChange = (newVolume) => {
      if (Math.abs(newVolume - volume) > 0.01) {
        dispatch({ type: 'SET_VOLUME', payload: newVolume });
      }
    };

    audioService.init(handleTimeUpdate, handleLoadedMetadata, handleEndedEvent, handleVolumeChange);
    
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
    };
  }, [dispatch, volume, handleEnded]);

  // Update audio when current song changes
  useEffect(() => {
    if (currentSong) {
      console.log('🎶 Setting new song:', currentSong.title, 'at index:', currentIndex);
      
      // Reset auto-advance flag for new song
      autoAdvanceTriggered.current = false;
      
      audioService.setSrc(currentSong.audioUrl);
      
      if (isPlaying) {
        audioService.play().then(() => {
          console.log('▶️ Started playing:', currentSong.title);
        }).catch(error => {
          console.error('❌ Error playing audio:', error);
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
    console.log('🔄 Next button clicked, current index:', currentIndex, 'queue length:', queue.length);
    
    if (repeatMode === 'one') {
      // Repeat current song
      audioService.setCurrentTime(0);
      audioService.play();
      return;
    }

    if (!queue || queue.length === 0) {
      console.log('❌ No queue available for next song');
      return;
    }

    let nextIndex;
    
    if (isShuffled) {
      // Random next song
      const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length > 0) {
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        console.log('🔀 Shuffle: jumping to random index', nextIndex);
        
        // For shuffle, we need to set the song and index manually
        dispatch({
          type: 'SET_CURRENT_SONG',
          payload: queue[nextIndex]
        });
        dispatch({
          type: 'SET_CURRENT_INDEX',
          payload: nextIndex
        });
        return;
      } else {
        nextIndex = currentIndex; // Only one song in queue
        return;
      }
    } else {
      nextIndex = currentIndex + 1;
      
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0; // Loop back to first song
          console.log('🔄 Repeat all: looping back to first song');
          
          dispatch({
            type: 'SET_CURRENT_SONG',
            payload: queue[0]
          });
          dispatch({
            type: 'SET_CURRENT_INDEX',
            payload: 0
          });
          return;
        } else {
          console.log('⏹️ End of queue reached');
          return; // End of queue
        }
      }
    }

    console.log('⏭️ Moving to next song at index:', nextIndex);
    
    // Use the NEXT_SONG action for normal sequential play
    dispatch({ type: 'NEXT_SONG' });
  }, [currentIndex, queue, repeatMode, isShuffled, dispatch]);

  const handlePrevious = useCallback(() => {
    console.log('🔄 Previous button clicked, current index:', currentIndex, 'current time:', currentTime);
    
    // If more than 3 seconds have passed, restart current song
    if (currentTime > 3) {
      audioService.setCurrentTime(0);
      return;
    }

    if (!queue || queue.length === 0) {
      console.log('❌ No queue available for previous song');
      return;
    }

    let prevIndex;
    
    if (isShuffled) {
      // Random previous song
      const availableIndices = queue.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length > 0) {
        prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        console.log('🔀 Shuffle: jumping to random index', prevIndex);
        
        // For shuffle, we need to set the song and index manually
        dispatch({
          type: 'SET_CURRENT_SONG',
          payload: queue[prevIndex]
        });
        dispatch({
          type: 'SET_CURRENT_INDEX',
          payload: prevIndex
        });
        return;
      } else {
        prevIndex = currentIndex; // Only one song in queue
        return;
      }
    } else {
      prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = queue.length - 1; // Loop to last song
          console.log('🔄 Repeat all: looping to last song');
          
          dispatch({
            type: 'SET_CURRENT_SONG',
            payload: queue[queue.length - 1]
          });
          dispatch({
            type: 'SET_CURRENT_INDEX',
            payload: queue.length - 1
          });
          return;
        } else {
          console.log('⏹️ Beginning of queue reached');
          return; // Beginning of queue
        }
      }
    }

    console.log('⏮️ Moving to previous song at index:', prevIndex);

    // Use the PREVIOUS_SONG action for normal sequential play
    dispatch({ type: 'PREVIOUS_SONG' });
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
    console.log('🔀 Toggling shuffle from', isShuffled, 'to', !isShuffled);
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, [dispatch, isShuffled]);

  const toggleRepeat = useCallback(() => {
    console.log('🔁 Toggling repeat from', repeatMode);
    dispatch({ type: 'SET_REPEAT_MODE' });
  }, [dispatch, repeatMode]);

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
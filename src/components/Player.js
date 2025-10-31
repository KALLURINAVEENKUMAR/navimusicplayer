import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume, Shuffle, Repeat, Heart, Disc3 } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useMusic } from '../context/MusicContext';
import './Player.css';

const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    dispatch
  } = useMusic();

  const {
    togglePlayPause,
    setVolume,
    seek,
    handleNext,
    handlePrevious,
    toggleShuffle,
    toggleRepeat,
    formatTime
  } = useAudioPlayer();

  const handleFavorite = () => {
    if (!currentSong) return;
    
    dispatch({
      type: 'ADD_TO_PLAYLIST',
      payload: {
        playlistId: 1, // Favorites playlist
        song: currentSong
      }
    });
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return (
      <div className="player player--empty">
        <div className="player__empty-state">
          <p>Select a song to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="player__song-info">
        <div className="player__artwork">
          <Disc3 size={32} color="#e74c3c" />
        </div>
        <div className="player__details">
          <h3 className="player__title">{currentSong.title}</h3>
          <p className="player__artist">{currentSong.artist}</p>
        </div>
        <div className="player__actions">
          <button 
            className="player__action-btn"
            onClick={handleFavorite}
            title="Add to favorites"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="player__controls">
        <div className="player__control-buttons">
          <button 
            className={`player__control-btn ${isShuffled ? 'active' : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Shuffle size={20} />
          </button>
          
          <button 
            className="player__control-btn"
            onClick={handlePrevious}
            title="Previous"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            className="player__play-btn"
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          
          <button 
            className="player__control-btn"
            onClick={handleNext}
            title="Next"
          >
            <SkipForward size={24} />
          </button>
          
          <button 
            className={`player__control-btn ${repeatMode !== 'none' ? 'active' : ''}`}
            onClick={toggleRepeat}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat size={20} />
            {repeatMode === 'one' && <span className="repeat-indicator">1</span>}
          </button>
        </div>

        <div className="player__progress">
          <span className="player__time">{formatTime(currentTime)}</span>
          <div className="player__progress-bar">
            <div 
              className="player__progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="player__progress-input"
            />
          </div>
          <span className="player__time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control - Right Side */}
      <div className="player__volume">
        <Volume size={18} />
        <div className="player__volume-bar">
          <div 
            className="player__volume-fill"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="player__volume-input"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
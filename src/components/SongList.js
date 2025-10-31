import React from 'react';
import { Play, Pause, Plus, Download, MoreHorizontal, Music, Clock, Album, Disc3 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import './SongList.css';

const SongList = ({ songs, title, showAddButton = true, playlistId = null }) => {
  const { currentSong, isPlaying, downloadedSongs, dispatch } = useMusic();
  const { playQueue, formatTime } = useAudioPlayer();

  const handlePlaySong = (song, index) => {
    if (currentSong && currentSong.id === song.id) {
      dispatch({ type: 'PLAY_PAUSE' });
    } else {
      playQueue(songs, index);
    }
  };

  const handleAddToPlaylist = (song) => {
    // This would open a playlist selection modal in a real app
    dispatch({
      type: 'ADD_TO_PLAYLIST',
      payload: {
        playlistId: 1, // Default to favorites
        song: song
      }
    });
  };

  const isCurrentSong = (song) => currentSong && currentSong.id === song.id;
  const isDownloaded = (song) => downloadedSongs.some(downloaded => downloaded.id === song.id);

  if (!songs || songs.length === 0) {
    return (
      <div className="song-list song-list--empty">
        <p>No songs available</p>
      </div>
    );
  }

  return (
    <div className="song-list">
      {title && (
        <div className="song-list__header">
          <h2 className="song-list__title">{title}</h2>
          <span className="song-list__count">{songs.length} songs</span>
        </div>
      )}
      
      <div className="song-list__table">
        <div className="song-list__table-header">
          <div className="song-list__cell song-list__cell--number">#</div>
          <div className="song-list__cell song-list__cell--title">
            <Music size={16} style={{ marginRight: '8px' }} />
            Title
          </div>
          <div className="song-list__cell song-list__cell--album">
            <Album size={16} style={{ marginRight: '8px' }} />
            Album
          </div>
          <div className="song-list__cell song-list__cell--duration">
            <Clock size={16} style={{ marginRight: '8px' }} />
            Duration
          </div>
          <div className="song-list__cell song-list__cell--actions">Actions</div>
        </div>
        
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className={`song-list__row ${isCurrentSong(song) ? 'song-list__row--active' : ''}`}
            onClick={() => handlePlaySong(song, index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="song-list__cell song-list__cell--number">
              <button
                className="song-list__play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySong(song, index);
                }}
              >
                {isCurrentSong(song) && isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </button>
              <span className="song-list__number">{index + 1}</span>
            </div>
            
            <div className="song-list__cell song-list__cell--title">
              <div className="song-list__song-info">
                <div className="song-list__artwork">
                  <Disc3 size={32} color="#e74c3c" />
                </div>
                <div className="song-list__text-info">
                  <div className="song-list__song-title">{song.title}</div>
                  <div className="song-list__artist">{song.artist}</div>
                </div>
                {isDownloaded(song) && (
                  <div className="song-list__download-indicator">
                    <Download size={14} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="song-list__cell song-list__cell--album">
              {song.album}
            </div>
            
            <div className="song-list__cell song-list__cell--duration">
              {formatTime(song.duration)}
            </div>
            
            <div className="song-list__cell song-list__cell--actions">
              <div className="song-list__actions">
                {showAddButton && (
                  <button
                    className="song-list__action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToPlaylist(song);
                    }}
                    title="Add to playlist"
                  >
                    <Plus size={16} />
                  </button>
                )}
                <button
                  className="song-list__action-btn"
                  onClick={(e) => e.stopPropagation()}
                  title="More options"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
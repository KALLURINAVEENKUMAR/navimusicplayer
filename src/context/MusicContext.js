import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MusicContext = createContext();

const initialState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  playlists: [
    {
      id: 1,
      name: 'My Favorites',
      songs: [],
      createdAt: new Date().toISOString(),
      coverImage: null
    }
  ],
  downloadedSongs: [],
  isShuffled: false,
  repeatMode: 'none', // 'none', 'one', 'all'
  searchResults: [],
  recommendations: []
};

const musicReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return {
        ...state,
        currentSong: action.payload,
        isPlaying: true,
        currentTime: 0
      };
    
    case 'PLAY_PAUSE':
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload
      };
    
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
        isPlaying: true,
        currentTime: 0
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload
      };
    
    case 'SET_CURRENT_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.payload,
        currentIndex: 0
      };
    
    case 'NEXT_SONG':
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.queue.length) {
        return {
          ...state,
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          isPlaying: true,
          currentTime: 0
        };
      } else if (state.repeatMode === 'all' && state.queue.length > 0) {
        // Loop back to first song
        return {
          ...state,
          currentIndex: 0,
          currentSong: state.queue[0],
          isPlaying: true,
          currentTime: 0
        };
      }
      return {
        ...state,
        isPlaying: false
      };
    
    case 'PREVIOUS_SONG':
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
          isPlaying: true,
          currentTime: 0
        };
      } else if (state.repeatMode === 'all' && state.queue.length > 0) {
        // Loop to last song
        return {
          ...state,
          currentIndex: state.queue.length - 1,
          currentSong: state.queue[state.queue.length - 1],
          isPlaying: true,
          currentTime: 0
        };
      }
      return state;
    
    case 'SONG_ENDED':
      // Handle song end - can be used to trigger next song
      return state;
    
    case 'ADD_PLAYLIST':
      return {
        ...state,
        playlists: [...state.playlists, action.payload]
      };
    
    case 'UPDATE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(playlist =>
          playlist.id === action.payload.id ? action.payload : playlist
        )
      };
    
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter(playlist => playlist.id !== action.payload)
      };
    
    case 'ADD_TO_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(playlist =>
          playlist.id === action.payload.playlistId
            ? { ...playlist, songs: [...playlist.songs, action.payload.song] }
            : playlist
        )
      };
    
    case 'REMOVE_FROM_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(playlist =>
          playlist.id === action.payload.playlistId
            ? { ...playlist, songs: playlist.songs.filter(song => song.id !== action.payload.songId) }
            : playlist
        )
      };
    
    case 'DOWNLOAD_SONG':
      return {
        ...state,
        downloadedSongs: [...state.downloadedSongs, action.payload]
      };
    
    case 'REMOVE_DOWNLOAD':
      return {
        ...state,
        downloadedSongs: state.downloadedSongs.filter(song => song.id !== action.payload)
      };
    
    case 'TOGGLE_SHUFFLE':
      return {
        ...state,
        isShuffled: !state.isShuffled
      };
    
    case 'SET_REPEAT_MODE':
      const modes = ['none', 'one', 'all'];
      const currentModeIndex = modes.indexOf(state.repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      return {
        ...state,
        repeatMode: nextMode
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload
      };
    
    case 'SET_DOWNLOADS':
      return {
        ...state,
        downloadedSongs: action.payload
      };
    
    case 'SET_PLAYLISTS':
      return {
        ...state,
        playlists: action.payload
      };
    
    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload
      };
    
    default:
      return state;
  }
};

export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  // Load saved state from localStorage
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('musicApp_playlists');
    const savedDownloads = localStorage.getItem('musicApp_downloads');
    
    if (savedPlaylists) {
      try {
        const playlists = JSON.parse(savedPlaylists);
        dispatch({ type: 'SET_PLAYLISTS', payload: playlists });
      } catch (error) {
        console.error('Error loading playlists:', error);
      }
    }
    
    if (savedDownloads) {
      try {
        const downloads = JSON.parse(savedDownloads);
        if (downloads.length > 0) {
          dispatch({ type: 'SET_DOWNLOADS', payload: downloads });
        }
      } catch (error) {
        console.error('Error loading downloads:', error);
      }
    }
  }, []); // Empty dependency array to run only once

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('musicApp_playlists', JSON.stringify(state.playlists));
  }, [state.playlists]);

  // Save downloads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('musicApp_downloads', JSON.stringify(state.downloadedSongs));
  }, [state.downloadedSongs]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
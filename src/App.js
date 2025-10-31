import React, { useState, useEffect } from 'react';
import { X, Music, Headphones, Search as SearchIcon, Music2, Disc3 } from 'lucide-react';
import { MusicProvider, useMusic } from './context/MusicContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Search from './components/Search';
import SongList from './components/SongList';
import Footer from './components/Footer';
import musicAPIService from './services/MusicAPIService';
import './App.css';

// Main App Content Component
const AppContent = () => {
  const [activeView, setActiveView] = useState('home');
  const [allSongs, setAllSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { dispatch } = useMusic();

  // Load all songs
  useEffect(() => {
    const loadSongs = async () => {
      try {
        console.log('Loading songs...');
        const songs = await musicAPIService.getAllSongs();
        console.log('Loaded songs:', songs);
        setAllSongs(songs);
        
        // Initialize the queue with all songs when they're loaded
        if (songs && songs.length > 0) {
          console.log('Setting initial queue with', songs.length, 'songs');
          dispatch({ type: 'SET_QUEUE', payload: songs });
        }
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, [dispatch]);

  // Filter songs based on search query
  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view changes
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'search':
        return <Search />;
      
      default:
        // Home view with all songs
        return (
          <div className="main-content">
            <div className="home">
              <div className="home__header">
                <h1>
                  <Music size={48} style={{ marginRight: '16px', display: 'inline-block' }} />
                  My Collections
                </h1>
                <p>
                  <Headphones size={20} style={{ marginRight: '8px', display: 'inline-block' }} />
                  Enjoy Navi's favorite Telugu songs
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-input-wrapper">
                  <SearchIcon size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search songs or MovieName"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="search-clear"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              {allSongs.length === 0 ? (
                <div className="loading">Loading songs...</div>
              ) : (
                <>
                  <SongList 
                    songs={filteredSongs} 
                    title={searchQuery ? `Search Results (${filteredSongs.length} songs)` : "All Songs"} 
                    showAddButton={false} 
                  />
                  <Footer />
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <Disc3 size={32} color="#e74c3c" className="mobile-logo" />
          <h1 className="mobile-title">Music Player</h1>
          <Music2 size={24} color="#e74c3c" className="mobile-music-icon" />
        </div>
      </div>

      {/* Mobile Overlay - removed since we're not using hamburger menu */}

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange}
        isMobileOpen={false}
      />
      
      {/* Main Content */}
      <main className="app__main">
        {renderMainContent()}
      </main>
      
      {/* Player */}
      <Player />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}

export default App;

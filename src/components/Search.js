import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Loader } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import musicAPIService from '../services/MusicAPIService';
import SongList from './SongList';
import './Search.css';

const Search = () => {
  const { searchResults, dispatch } = useMusic();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularGenres, setPopularGenres] = useState([]);

  // Load recent searches and genres on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const genres = await musicAPIService.getGenres();
        setPopularGenres(genres.slice(0, 6)); // Show first 6 genres
        
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Search function with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        const performSearch = async () => {
          setIsLoading(true);
          try {
            const results = await musicAPIService.searchSongs(query);
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
            
            // Add to recent searches
            const newRecentSearches = [
              query,
              ...recentSearches.filter(search => search !== query)
            ].slice(0, 10);
            
            setRecentSearches(newRecentSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
          } catch (error) {
            console.error('Search error:', error);
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
          } finally {
            setIsLoading(false);
          }
        };
        performSearch();
      } else {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch, recentSearches]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
  };

  // Handle genre search
  const handleGenreSearch = (genre) => {
    setQuery(genre);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="search">
      <div className="search__header">
        <div className="search__input-container">
          <SearchIcon size={24} className="search__input-icon" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={handleSearchChange}
            className="search__input"
          />
          {query && (
            <button 
              className="search__clear-btn"
              onClick={clearSearch}
            >
              <X size={20} />
            </button>
          )}
          {isLoading && (
            <div className="search__loading">
              <Loader size={20} className="spinner" />
            </div>
          )}
        </div>
      </div>

      <div className="search__content">
        {!query && !searchResults.length ? (
          <div className="search__default">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="search__section">
                <div className="search__section-header">
                  <h2>Recent searches</h2>
                  <button 
                    className="search__clear-all"
                    onClick={clearRecentSearches}
                  >
                    Clear all
                  </button>
                </div>
                <div className="search__recent-list">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="search__recent-item"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <SearchIcon size={16} />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Browse by Genre */}
            <div className="search__section">
              <h2>Browse by genre</h2>
              <div className="search__genre-grid">
                {popularGenres.map((genre, index) => (
                  <button
                    key={genre}
                    className="search__genre-card"
                    onClick={() => handleGenreSearch(genre)}
                    style={{ 
                      backgroundColor: getGenreColor(index),
                    }}
                  >
                    <span>{genre}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="search__results">
            {searchResults.length > 0 ? (
              <SongList 
                songs={searchResults} 
                title={`Search results for "${query}"`}
              />
            ) : query && !isLoading ? (
              <div className="search__no-results">
                <h2>No results found for "{query}"</h2>
                <p>Please make sure your words are spelled correctly or use fewer or different keywords.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Generate colors for genre cards
function getGenreColor(index) {
  const colors = [
    '#ff006e', '#8338ec', '#3a86ff', '#06ffa5',
    '#ffbe0b', '#fb5607', '#e63946', '#2a9d8f',
    '#264653', '#f77f00', '#fcbf49', '#d62828'
  ];
  return colors[index % colors.length];
}

export default Search;
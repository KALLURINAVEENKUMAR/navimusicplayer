import React from 'react';
import { Home, Search, Disc, Library } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange, isMobileOpen }) => {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">♪</div>
          <span className="sidebar__logo-text">Music Player</span>
        </div>
        
        <nav className="sidebar__nav">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar__nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__section">
          <div className="sidebar__section-header">
            <h3>
              <Library size={16} style={{ marginRight: '8px', display: 'inline-block' }} />
              Your Music
            </h3>
          </div>
          
          <div className="sidebar__music-info">
            <div className="sidebar__info-item">
              <Disc size={20} />
              <span>All your songs in one place</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
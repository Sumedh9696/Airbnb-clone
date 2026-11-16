import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, User, Compass, Sparkles, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSearch }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <svg viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.479.96 3.518l.011.5c0 4.14-3.36 7.5-7.5 7.5-3.056 0-5.698-1.83-6.89-4.46l-.11-.25-.11.25C13.698 30.17 11.056 32 8 32c-4.14 0-7.5-3.36-7.5-7.5 0-1.039.243-1.927.91-3.518l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C10.537 1.963 11.992 1 14 1h2zm0 2h-2c-1.256 0-2.316.637-3.398 2.564l-.53 1.018C8.113 10.42 3.96 19.117 3.01 21.328l-.134.325c-.569 1.356-.776 2.064-.817 2.847L2.05 25c0 3.037 2.463 5.5 5.5 5.5 2.534 0 4.675-1.722 5.275-4.08l.125-.56.55.22c.767.307 1.603.47 2.5.47.897 0 1.733-.163 2.5-.47l.55-.22.125.56c.6 2.358 2.741 4.08 5.275 4.08 3.037 0 5.5-2.463 5.5-5.5 0-.783-.207-1.491-.776-2.847l-.134-.325c-.95-2.21-5.103-10.908-7.062-14.746l-.53-1.018C19.316 3.637 18.256 3 17 3h-1zm0 13c2.761 0 5 2.239 5 5 0 2.298-1.55 4.234-3.666 4.81l-.334.08c-.328.073-.664.11-1 .11-.336 0-.672-.037-1-.11l-.334-.08C12.55 25.234 11 23.298 11 21c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.306.835 2.417 2 2.829V21a1 1 0 1 1 2 0v2.829c1.165-.412 2-1.523 2-2.829 0-1.657-1.343-3-3-3z"/>
          </svg>
          <span>airbnb</span>
        </Link>

        {/* Search Bar Pill */}
        <div className="nav-search-pill" onClick={onOpenSearch}>
          <span className="pill-section">Anywhere</span>
          <div className="pill-divider" />
          <span className="pill-section">Any week</span>
          <div className="pill-divider" />
          <span className="pill-section dim">Add guests</span>
          <div className="search-btn-circle">
            <Search size={14} strokeWidth={3} />
          </div>
        </div>

        {/* User Menu Actions */}
        <div className="nav-user-actions" ref={dropdownRef}>
          {user && user.role === 'host' ? (
            <Link to="/host/dashboard" className="host-toggle-btn">
              Host Dashboard
            </Link>
          ) : (
            <Link to={user ? "/host/dashboard" : "/login"} className="host-toggle-btn">
              Airbnb your home
            </Link>
          )}

          <button className="user-pill-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Menu size={18} />
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="user-avatar-img" />
            ) : (
              <User size={18} className="user-icon-circle" />
            )}
          </button>

          {dropdownOpen && (
            <div className="user-dropdown-menu">
              {user ? (
                <>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#717171' }}>{user.email}</div>
                  </div>
                  <Link to="/trips" onClick={() => setDropdownOpen(false)}>
                    My Trips & Bookings
                  </Link>
                  <Link to="/host/dashboard" onClick={() => setDropdownOpen(false)}>
                    Host Portal
                  </Link>
                  <div className="menu-divider" />
                  <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setDropdownOpen(false)} style={{ fontWeight: 600 }}>
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setDropdownOpen(false)}>
                    Sign up
                  </Link>
                  <div className="menu-divider" />
                  <Link to="/login" onClick={() => setDropdownOpen(false)}>
                    Airbnb your home
                  </Link>
                  <Link to="/" onClick={() => setDropdownOpen(false)}>
                    Help Center
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

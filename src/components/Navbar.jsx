import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Navbar({ user, onLogout }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      // Ignore errors
    }
  };

  return (
    <nav style={{
      background: '#343a40',
      color: 'white',
      padding: '15px 0',
      marginBottom: '20px'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            Vastgoed & Partners
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/requests" style={{ color: 'white', textDecoration: 'none' }}>Requests</Link>
          <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', position: 'relative', display: 'inline-block', paddingRight: unreadCount > 0 ? '25px' : '0' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '0',
                background: '#dc3545',
                color: 'white',
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: unreadCount > 9 ? '0 6px' : '0',
                lineHeight: '20px'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          {user.role === 'renter' && (
            <Link to="/requests/new" style={{ color: 'white', textDecoration: 'none' }}>New Request</Link>
          )}
          <span>Logged in as: {user.email} ({user.role})</span>
          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '5px 15px' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
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


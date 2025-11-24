import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Dashboard({ user }) {
  const [stats, setStats] = useState({ requests: 0, pending: 0, scheduled: 0 });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/maintenance');
      const requests = response.data;
      setStats({
        requests: requests.length,
        pending: requests.filter(r => r.status === 'pending' || r.status === 'notified_owner').length,
        scheduled: requests.filter(r => r.status === 'scheduled').length
      });
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <h3>Total Requests</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.requests}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>{stats.pending}</p>
        </div>
        <div className="card">
          <h3>Scheduled</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{stats.scheduled}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Recent Requests</h2>
        {recentRequests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <Link to={`/requests/${req.id}`}>{req.title}</Link>
                  </td>
                  <td style={{ padding: '10px' }}>{req.category}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`status-badge status-${req.status}`}>{req.status}</span>
                  </td>
                  <td style={{ padding: '10px' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;


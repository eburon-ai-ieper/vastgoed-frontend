import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function MaintenanceRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/maintenance');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Maintenance Requests</h1>
      {requests.length === 0 ? (
        <div className="card">
          <p>No maintenance requests found.</p>
          {user.role === 'renter' && (
            <Link to="/requests/new" className="btn btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>
              Create New Request
            </Link>
          )}
        </div>
      ) : (
        <div>
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3><Link to={`/requests/${req.id}`}>{req.title}</Link></h3>
                  <p>{req.description}</p>
                  <p><strong>Category:</strong> {req.category} | <strong>Priority:</strong> {req.priority}</p>
                  <p><strong>Created:</strong> {new Date(req.created_at + 'Z').toLocaleString()}</p>
                </div>
                <div>
                  <span className={`status-badge status-${req.status}`}>{req.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MaintenanceRequests;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function RequestDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/maintenance/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  if (loading) return <div>Loading...</div>;
  if (!request) return <div>Request not found</div>;

  const canSelectContractor = user.role === 'owner' && request.status === 'notified_owner';
  const canSchedule = user.role === 'broker' && request.status === 'contractor_selected';
  const canNotifyOwner = user.role === 'broker' && request.status === 'pending';

  const handleNotifyOwner = async () => {
    setActionLoading(true);
    setActionMessage('');
    try {
      const response = await api.post(`/maintenance/${id}/notify-owner`);
      setActionMessage(response.data.message || 'Owner notified successfully!');
      // Refresh request data
      await fetchRequest();
    } catch (error) {
      setActionMessage(error.response?.data?.error || 'Error notifying owner');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1>Maintenance Request Details</h1>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <h2>{request.title}</h2>
            <span className={`status-badge status-${request.status}`}>{request.status}</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Description:</strong>
          <p>{request.description}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
          <div><strong>Category:</strong> {request.category}</div>
          <div><strong>Priority:</strong> {request.priority}</div>
          <div><strong>Created:</strong> {new Date(request.created_at + 'Z').toLocaleString()}</div>
          <div><strong>Updated:</strong> {new Date(request.updated_at + 'Z').toLocaleString()}</div>
        </div>

        {actionMessage && (
          <div style={{ 
            padding: '10px', 
            background: actionMessage.includes('Error') ? '#f8d7da' : '#d4edda', 
            border: `1px solid ${actionMessage.includes('Error') ? '#dc3545' : '#28a745'}`, 
            borderRadius: '4px', 
            color: actionMessage.includes('Error') ? '#721c24' : '#155724',
            marginBottom: '15px'
          }}>
            {actionMessage}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          {canNotifyOwner && (
            <button 
              onClick={handleNotifyOwner} 
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? 'Notifying...' : 'Notify Owner'}
            </button>
          )}

          {canSelectContractor && (
            <Link to={`/requests/${id}/select-contractor`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
              Select Contractor
            </Link>
          )}

          {canSchedule && (
            <Link to={`/requests/${id}/schedule`} className="btn btn-primary" style={{ marginLeft: '10px' }}>
              Schedule Appointment
            </Link>
          )}

          {!canNotifyOwner && !canSelectContractor && !canSchedule && (
            <div style={{ padding: '10px', background: '#e9ecef', borderRadius: '4px', color: '#6c757d' }}>
              {user.role === 'broker' && request.status === 'pending' && 'Click "Notify Owner" to proceed'}
              {user.role === 'broker' && request.status === 'notified_owner' && 'Waiting for owner to select a contractor...'}
              {user.role === 'broker' && request.status === 'contractor_selected' && 'Click "Schedule Appointment" to proceed'}
              {user.role === 'owner' && request.status === 'pending' && 'Waiting for broker to notify you...'}
              {user.role === 'owner' && request.status === 'notified_owner' && 'Click "Select Contractor" to proceed'}
              {user.role === 'renter' && 'Your request is being processed. You will be notified when an appointment is scheduled.'}
              {user.role === 'contractor' && 'You have been assigned to this request. Waiting for appointment scheduling...'}
            </div>
          )}
        </div>

        {request.workflow_logs && request.workflow_logs.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Workflow History</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {request.workflow_logs.map((log, idx) => (
                <li key={idx} style={{ padding: '10px', borderLeft: '3px solid #007bff', marginBottom: '10px', background: '#f8f9fa' }}>
                  <strong>{log.step}</strong> - {log.details}
                  <br />
                  <small>{new Date(log.created_at + 'Z').toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestDetail;


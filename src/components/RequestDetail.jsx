import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

function RequestDetail({ user }) {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/maintenance/${id}`);
      if (response.data) {
        setRequest(response.data);
      } else {
        console.error('No data in response:', response);
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  if (loading) return <div>Loading...</div>;
  if (!request) return <div>Request not found</div>;

  const canSelectContractor = user.role === 'owner' && request.status === 'notified_owner';
  const canNotifyOwner = user.role === 'broker' && request.status === 'pending';
  const canScheduleAppointment = user.role === 'contractor' && request.status === 'contractor_selected' && request.contractor_id === user.id;

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

        {/* Renter and Property Information - Important for contractors */}
        {(user.role === 'contractor' || user.role === 'broker' || user.role === 'owner') && (
          <div style={{ marginBottom: '15px', padding: '15px', background: '#e7f3ff', border: '1px solid #007bff', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#007bff' }}>📍 Location & Contact Information</h3>
            {request.property && request.property.address ? (
              <div style={{ marginBottom: '10px' }}>
                <strong>Property Address:</strong> {request.property.address}
              </div>
            ) : (
              <div style={{ marginBottom: '10px', color: '#856404' }}>
                <strong>Property Address:</strong> <em>Address information not available</em>
              </div>
            )}
            {request.renter && request.renter.name ? (
              <div>
                <strong>Renter:</strong> {request.renter.name}
                {request.renter.email && ` (${request.renter.email})`}
                {request.renter.phone && ` - Phone: ${request.renter.phone}`}
              </div>
            ) : (
              <div style={{ color: '#856404' }}>
                <strong>Renter:</strong> <em>Contact information not available</em>
              </div>
            )}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
          <div><strong>Category:</strong> {request.category}</div>
          <div><strong>Priority:</strong> {request.priority}</div>
          <div><strong>Created:</strong> {new Date(request.created_at + 'Z').toLocaleString()}</div>
          <div><strong>Updated:</strong> {new Date(request.updated_at + 'Z').toLocaleString()}</div>
          {request.schedule && (
            <>
              <div><strong>Scheduled Date:</strong> {
                (() => {
                  const dateStr = request.schedule.scheduled_date;
                  // If date string doesn't have timezone info (Z, +, or - at position 10+), parse as local time
                  const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.lastIndexOf('-') > 10);
                  const date = hasTimezone ? new Date(dateStr) : new Date(dateStr.replace('T', ' '));
                  return date.toLocaleString();
                })()
              }</div>
              {request.schedule.notes && (
                <div><strong>Notes:</strong> {request.schedule.notes}</div>
              )}
            </>
          )}
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
            <Link 
              to={request.selection_token ? `/select-contractor/${request.selection_token}` : '#'} 
              className="btn btn-primary" 
              style={{ marginLeft: '10px' }}
            >
              Select Contractor
            </Link>
          )}

          {canScheduleAppointment && request.selection_token && (
            <Link 
              to={`/schedule-appointment/${request.selection_token}`} 
              className="btn btn-primary" 
              style={{ marginLeft: '10px' }}
            >
              Schedule Appointment
            </Link>
          )}

          {!canNotifyOwner && !canSelectContractor && !canScheduleAppointment && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '4px',
              ...(request.status === 'scheduled' || request.status === 'completed' ? {
                background: '#d4edda',
                border: '1px solid #28a745',
                color: '#155724'
              } : request.status === 'in_progress' ? {
                background: '#d1ecf1',
                border: '1px solid #17a2b8',
                color: '#0c5460'
              } : {
                background: '#fff3cd',
                border: '1px solid #ffc107',
                color: '#856404'
              })
            }}>
              {user.role === 'broker' && request.status === 'pending' && 'Click "Notify Owner" to proceed'}
              {user.role === 'broker' && request.status === 'notified_owner' && 'Waiting for owner to select a contractor...'}
              {user.role === 'broker' && request.status === 'contractor_selected' && 'Waiting for contractor to schedule the appointment. The contractor received an email with a link to schedule.'}
              {user.role === 'broker' && request.status === 'scheduled' && request.schedule && (() => {
                const dateStr = request.schedule.scheduled_date;
                const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.lastIndexOf('-') > 10);
                const date = hasTimezone ? new Date(dateStr) : new Date(dateStr.replace('T', ' '));
                return `✓ Appointment scheduled for: ${date.toLocaleString()}`;
              })()}
              {user.role === 'broker' && request.status === 'in_progress' && 'Appointment is in progress.'}
              {user.role === 'broker' && request.status === 'completed' && '✓ Request has been completed.'}
              {user.role === 'owner' && request.status === 'pending' && 'Waiting for broker to notify you...'}
              {user.role === 'owner' && request.status === 'notified_owner' && 'Click "Select Contractor" to proceed'}
              {user.role === 'owner' && request.status === 'contractor_selected' && 'Waiting for contractor to schedule the appointment. The contractor received an email with a link to schedule.'}
              {user.role === 'owner' && request.status === 'scheduled' && request.schedule && (() => {
                const dateStr = request.schedule.scheduled_date;
                const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.lastIndexOf('-') > 10);
                const date = hasTimezone ? new Date(dateStr) : new Date(dateStr.replace('T', ' '));
                return `✓ Appointment scheduled for: ${date.toLocaleString()}`;
              })()}
              {user.role === 'owner' && request.status === 'in_progress' && 'Appointment is in progress.'}
              {user.role === 'owner' && request.status === 'completed' && '✓ Request has been completed.'}
              {user.role === 'renter' && request.status === 'pending' && 'Your request has been submitted. Waiting for broker to process...'}
              {user.role === 'renter' && request.status === 'notified_owner' && 'Broker has notified the owner. Waiting for owner to select a contractor...'}
              {user.role === 'renter' && request.status === 'contractor_selected' && 'Waiting for contractor to schedule the appointment. The contractor received an email with a link to schedule.'}
              {user.role === 'renter' && request.status === 'scheduled' && request.schedule && (() => {
                const dateStr = request.schedule.scheduled_date;
                const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.lastIndexOf('-') > 10);
                const date = hasTimezone ? new Date(dateStr) : new Date(dateStr.replace('T', ' '));
                return `✓ Appointment scheduled for: ${date.toLocaleString()}`;
              })()}
              {user.role === 'renter' && request.status === 'in_progress' && 'Appointment is in progress.'}
              {user.role === 'renter' && request.status === 'completed' && '✓ Request has been completed.'}
              {user.role === 'contractor' && request.status === 'scheduled' && request.schedule && (() => {
                const dateStr = request.schedule.scheduled_date;
                const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.lastIndexOf('-') > 10);
                const date = hasTimezone ? new Date(dateStr) : new Date(dateStr.replace('T', ' '));
                return `✓ Appointment scheduled for: ${date.toLocaleString()}`;
              })()}
              {user.role === 'contractor' && request.status === 'in_progress' && 'Appointment is in progress.'}
              {user.role === 'contractor' && request.status === 'completed' && '✓ Request has been completed.'}
              {user.role === 'contractor' && request.status === 'contractor_selected' && 'Click "Schedule Appointment" to schedule the appointment.'}
              {user.role === 'contractor' && request.status !== 'contractor_selected' && request.status !== 'scheduled' && request.status !== 'in_progress' && request.status !== 'completed' && 'You have been assigned to this request. Waiting for appointment scheduling...'}
            </div>
          )}
        </div>

        {request.workflow_logs && request.workflow_logs.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Workflow History</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {request.workflow_logs.map((log, idx) => {
                // Format date strings in details (replace T with space in ISO date-time strings)
                const formattedDetails = log.details ? log.details.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/g, '$1 $2') : log.details;
                return (
                  <li key={idx} style={{ padding: '10px', borderLeft: '3px solid #007bff', marginBottom: '10px', background: '#f8f9fa' }}>
                    <strong>{log.step}</strong> - {formattedDetails}
                    <br />
                    <small>{new Date(log.created_at + 'Z').toLocaleString()}</small>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestDetail;


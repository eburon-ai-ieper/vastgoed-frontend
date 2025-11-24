import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function SelectContractor() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/maintenance/select-contractor/${token}`);
      setRequest(response.data.request);
      setContractors(response.data.contractors);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load request');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContractor) {
      setError('Please select a contractor');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post(`/maintenance/select-contractor/${token}`, {
        contractor_id: selectedContractor
      });
      setSuccess(true);
      setSubmitting(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to select contractor');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="container">
        <div className="card">
          <h2>Error</h2>
          <p style={{ color: '#dc3545' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#28a745' }}>✓ Contractor Selected Successfully!</h2>
          <p>The contractor has been notified and will receive an email with a link to schedule the appointment.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Select Contractor</h1>
      <div className="card">
        {request && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Maintenance Request</h3>
            <p><strong>Title:</strong> {request.title}</p>
            <p><strong>Description:</strong> {request.description}</p>
            <p><strong>Category:</strong> {request.category}</p>
            <p><strong>Priority:</strong> {request.priority}</p>
            {request.renter_available_times && request.renter_available_times.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Renter Available Times:</strong>
                <ul>
                  {request.renter_available_times.map((timeSlot, idx) => {
                    let displayText = '';
                    if (typeof timeSlot === 'string') {
                      // Legacy format - simple datetime string
                      displayText = new Date(timeSlot).toLocaleString();
                    } else if (timeSlot.type === 'specific') {
                      displayText = `${new Date(timeSlot.date + 'T' + timeSlot.timeFrom).toLocaleDateString()} from ${timeSlot.timeFrom} to ${timeSlot.timeTo || timeSlot.timeFrom}`;
                    } else if (timeSlot.type === 'weekend') {
                      displayText = `All weekends (Saturday & Sunday) from ${timeSlot.timeFrom} to ${timeSlot.timeTo || timeSlot.timeFrom}`;
                    } else if (timeSlot.type === 'weekday') {
                      displayText = `All weekdays (Monday-Friday) from ${timeSlot.timeFrom} to ${timeSlot.timeTo || timeSlot.timeFrom}`;
                    }
                    return (
                      <li key={idx}>{displayText}</li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Contractor</label>
            {contractors.length === 0 ? (
              <p style={{ color: '#dc3545' }}>No contractors available</p>
            ) : (
              <select
                required
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="">Choose a contractor...</option>
                {contractors.map((contractor) => (
                  <option key={contractor.user_id} value={contractor.user_id}>
                    {contractor.company_name} - {contractor.name} 
                    {contractor.rating && ` (Rating: ${contractor.rating})`}
                    {contractor.specialties && contractor.specialties.length > 0 && 
                      ` - Specialties: ${contractor.specialties.join(', ')}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div style={{ color: '#dc3545', marginBottom: '15px' }}>{error}</div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting || contractors.length === 0}
          >
            {submitting ? 'Selecting...' : 'Select Contractor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SelectContractor;


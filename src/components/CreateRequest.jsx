import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function CreateRequest({ user }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    property_id: '',
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
    renter_available_times: []
  });
  const [availableTime, setAvailableTime] = useState({ date: '', time: '', timeTo: '' });
  const [availabilityType, setAvailabilityType] = useState('specific'); // 'specific', 'weekend', 'weekday'
  const [weekdayAvailability, setWeekdayAvailability] = useState({ timeFrom: '', timeTo: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const isSubmittingRef = useRef(false); // Synchronous ref to prevent multiple submissions

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
    
    // Check both ref and state for maximum protection
    if (isSubmittingRef.current || submitting) {
      return; // Prevent multiple submissions
    }

    // Validate required fields
    if (!formData.renter_available_times || formData.renter_available_times.length === 0) {
      setSubmitMessage('Error: Please specify at least one available time slot.');
      return;
    }

    // Set ref immediately (synchronous)
    isSubmittingRef.current = true;
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await api.post('/maintenance', formData);
      setSubmitMessage('Maintenance request created! Broker has been notified.');
      // Clear form
      setFormData({
        property_id: '',
        title: '',
        description: '',
        category: 'plumbing',
        priority: 'medium',
        renter_available_times: []
      });
      setAvailableTime({ date: '', time: '', timeTo: '' });
      setWeekdayAvailability({ timeFrom: '', timeTo: '' });
      setAvailabilityType('specific');
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/requests');
      }, 2000);
    } catch (error) {
      setSubmitMessage(error.response?.data?.error || 'Error creating request');
      setSubmitting(false);
      isSubmittingRef.current = false; // Reset on error
    }
  };

  return (
    <div>
      <h1>Create Maintenance Request</h1>
      <div className="card">
        <form 
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevent Enter key from submitting if already submitting
            if ((e.key === 'Enter' || e.keyCode === 13) && (submitting || isSubmittingRef.current)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div className="form-group">
            <label>Property</label>
            {properties.length === 0 ? (
              <div style={{ padding: '10px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
                <strong>No properties available.</strong> 
                {user.role === 'renter' && ' Please contact your broker to assign you to a property.'}
                {user.role === 'broker' && ' Create a property first, then assign a renter to it.'}
                {user.role === 'owner' && ' Create a property first.'}
              </div>
            ) : (
              <select
                required
                disabled={submitting}
                value={formData.property_id}
                onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              >
                <option value="">Select a property</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>{prop.address}</option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              required
              disabled={submitting}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Leaking faucet in kitchen"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              required
              disabled={submitting}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              disabled={submitting}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="heating">Heating</option>
              <option value="appliances">Appliances</option>
              <option value="structural">Structural</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              disabled={submitting}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Your Available Times <span style={{ color: '#dc3545' }}>*</span></label>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              Please specify when you're available. Choose how you want to specify your availability.
            </p>
            
            {/* Availability Type Selection */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setAvailabilityType('specific')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: availabilityType === 'specific' ? '#007bff' : 'white',
                  color: availabilityType === 'specific' ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                Specific Date/Time
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setAvailabilityType('weekend')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: availabilityType === 'weekend' ? '#007bff' : 'white',
                  color: availabilityType === 'weekend' ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                All Weekend
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setAvailabilityType('weekday')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: availabilityType === 'weekday' ? '#007bff' : 'white',
                  color: availabilityType === 'weekday' ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                Weekdays (Time Range)
              </button>
            </div>

            {/* Specific Date/Time Input */}
            {availabilityType === 'specific' && (
              <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>Add specific date and time slot:</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    disabled={submitting}
                    value={availableTime.date}
                    onChange={(e) => setAvailableTime({ ...availableTime, date: e.target.value })}
                    style={{ flex: 1, minWidth: '150px' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    From:
                    <input
                      type="time"
                      disabled={submitting}
                      value={availableTime.time}
                      onChange={(e) => setAvailableTime({ ...availableTime, time: e.target.value })}
                      style={{ flex: 1, minWidth: '100px' }}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    To:
                    <input
                      type="time"
                      disabled={submitting}
                      value={availableTime.timeTo}
                      onChange={(e) => setAvailableTime({ ...availableTime, timeTo: e.target.value })}
                      style={{ flex: 1, minWidth: '100px' }}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={submitting || !availableTime.date || !availableTime.time}
                    onClick={() => {
                      if (availableTime.date && availableTime.time) {
                        const timeSlot = {
                          type: 'specific',
                          date: availableTime.date,
                          timeFrom: availableTime.time,
                          timeTo: availableTime.timeTo || availableTime.time
                        };
                        setFormData({
                          ...formData,
                          renter_available_times: [...formData.renter_available_times, timeSlot]
                        });
                        setAvailableTime({ date: '', time: '', timeTo: '' });
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Weekend Availability */}
            {availabilityType === 'weekend' && (
              <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Add weekend availability (Saturday and Sunday):</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    From:
                    <input
                      type="time"
                      disabled={submitting}
                      value={weekdayAvailability.timeFrom}
                      onChange={(e) => setWeekdayAvailability({ ...weekdayAvailability, timeFrom: e.target.value })}
                      style={{ minWidth: '100px' }}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    To:
                    <input
                      type="time"
                      disabled={submitting}
                      value={weekdayAvailability.timeTo}
                      onChange={(e) => setWeekdayAvailability({ ...weekdayAvailability, timeTo: e.target.value })}
                      style={{ minWidth: '100px' }}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={submitting || !weekdayAvailability.timeFrom}
                    onClick={() => {
                      if (weekdayAvailability.timeFrom) {
                        const timeSlot = {
                          type: 'weekend',
                          timeFrom: weekdayAvailability.timeFrom,
                          timeTo: weekdayAvailability.timeTo || weekdayAvailability.timeFrom
                        };
                        setFormData({
                          ...formData,
                          renter_available_times: [...formData.renter_available_times, timeSlot]
                        });
                        setWeekdayAvailability({ timeFrom: '', timeTo: '' });
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Add Weekend
                  </button>
                </div>
              </div>
            )}

            {/* Weekday Availability */}
            {availabilityType === 'weekday' && (
              <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Add weekday availability (Monday to Friday):</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    From:
                    <input
                      type="time"
                      disabled={submitting}
                      value={weekdayAvailability.timeFrom}
                      onChange={(e) => setWeekdayAvailability({ ...weekdayAvailability, timeFrom: e.target.value })}
                      style={{ minWidth: '100px' }}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    To:
                    <input
                      type="time"
                      disabled={submitting}
                      value={weekdayAvailability.timeTo}
                      onChange={(e) => setWeekdayAvailability({ ...weekdayAvailability, timeTo: e.target.value })}
                      style={{ minWidth: '100px' }}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={submitting || !weekdayAvailability.timeFrom}
                    onClick={() => {
                      if (weekdayAvailability.timeFrom) {
                        const timeSlot = {
                          type: 'weekday',
                          timeFrom: weekdayAvailability.timeFrom,
                          timeTo: weekdayAvailability.timeTo || weekdayAvailability.timeFrom
                        };
                        setFormData({
                          ...formData,
                          renter_available_times: [...formData.renter_available_times, timeSlot]
                        });
                        setWeekdayAvailability({ timeFrom: '', timeTo: '' });
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Add Weekdays
                  </button>
                </div>
              </div>
            )}

            {/* Display Selected Times */}
            {formData.renter_available_times.length > 0 && (
              <div style={{ marginTop: '15px', padding: '15px', background: '#e9ecef', borderRadius: '4px' }}>
                <strong>Selected availability:</strong>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {formData.renter_available_times.map((timeSlot, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {timeSlot.type === 'specific' && (
                        <span>
                          {new Date(timeSlot.date + 'T' + timeSlot.timeFrom).toLocaleDateString()} from {timeSlot.timeFrom} to {timeSlot.timeTo || timeSlot.timeFrom}
                        </span>
                      )}
                      {timeSlot.type === 'weekend' && (
                        <span>
                          All weekends (Saturday & Sunday) from {timeSlot.timeFrom} to {timeSlot.timeTo || timeSlot.timeFrom}
                        </span>
                      )}
                      {timeSlot.type === 'weekday' && (
                        <span>
                          All weekdays (Monday-Friday) from {timeSlot.timeFrom} to {timeSlot.timeTo || timeSlot.timeFrom}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            renter_available_times: formData.renter_available_times.filter((_, i) => i !== idx)
                          });
                        }}
                        style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {submitMessage && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '15px',
              background: submitMessage.includes('Error') ? '#f8d7da' : '#d4edda', 
              border: `1px solid ${submitMessage.includes('Error') ? '#dc3545' : '#28a745'}`, 
              borderRadius: '4px', 
              color: submitMessage.includes('Error') ? '#721c24' : '#155724'
            }}>
              {submitMessage}
            </div>
          )}
          
          {formData.renter_available_times.length === 0 && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '15px',
              background: '#fff3cd', 
              border: '1px solid #ffc107', 
              borderRadius: '4px', 
              color: '#856404'
            }}>
              ⚠️ Please add at least one available time slot before submitting.
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting || isSubmittingRef.current || formData.renter_available_times.length === 0}
            onClick={(e) => {
              if (submitting || isSubmittingRef.current || formData.renter_available_times.length === 0) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function ScheduleAppointment({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    scheduled_date: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/maintenance/${id}/schedule`, formData);
      alert('Appointment scheduled! Contractor and renter have been notified.');
      navigate(`/requests/${id}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Error scheduling appointment');
    }
  };

  return (
    <div>
      <h1>Schedule Appointment</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information for the contractor or renter..."
            />
          </div>
          <button type="submit" className="btn btn-primary">Schedule Appointment</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/requests/${id}`)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleAppointment;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function ContractorSelection({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await api.get('/contractors');
      setContractors(response.data);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/maintenance/${id}/select-contractor`, {
        contractor_id: selectedContractor
      });
      alert('Contractor selected! Contractor and broker have been notified.');
      navigate(`/requests/${id}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Error selecting contractor');
    }
  };

  if (loading) return <div>Loading contractors...</div>;

  return (
    <div>
      <h1>Select Contractor</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Choose a Contractor</label>
            <select
              required
              value={selectedContractor}
              onChange={(e) => setSelectedContractor(e.target.value)}
            >
              <option value="">Select a contractor...</option>
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.user_id}>
                  {contractor.company_name || contractor.name} - {contractor.specialties?.join(', ') || 'General'}
                  {contractor.rating > 0 && ` (⭐ ${contractor.rating})`}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Select Contractor</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/requests/${id}`)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContractorSelection;


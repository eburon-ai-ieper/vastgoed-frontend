import React, { useState } from 'react';
import api from '../utils/api';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'renter',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        const response = await api.post('/auth/register', formData);
        if (response.data) {
          // Auto-login after registration
          const loginResponse = await api.post('/auth/login', {
            email: formData.email,
            password: formData.password
          });
          onLogin(loginResponse.data.user, loginResponse.data.token);
        }
      } else {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        onLogin(response.data.user, response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <div className="card">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        {!isRegister && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            background: '#e7f3ff', 
            border: '1px solid #b3d9ff', 
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            <strong style={{ display: 'block', marginBottom: '10px', color: '#0066cc' }}>📋 Demo Accounts (Password: demo123)</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <strong>Broker:</strong><br />
                <code style={{ fontSize: '12px' }}>broker@partners-vastgoed.com</code>
              </div>
              <div>
                <strong>Owner:</strong><br />
                <code style={{ fontSize: '12px' }}>jeanpierre.callant@example.com</code>
              </div>
              <div>
                <strong>Renter:</strong><br />
                <code style={{ fontSize: '12px' }}>michaelvh89@hotmail.com</code>
              </div>
              <div>
                <strong>Contractor:</strong><br />
                <code style={{ fontSize: '12px' }}>mvh@allroundworks.com</code>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Click on any email to auto-fill the login form
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="renter">Renter</option>
                  <option value="broker">Broker</option>
                  <option value="owner">Home Owner</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {!isRegister && (
              <div style={{ marginTop: '5px', fontSize: '12px' }}>
                Quick fill: 
                <button type="button" onClick={() => setFormData({ ...formData, email: 'broker@partners-vastgoed.com' })} style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Broker</button>
                <button type="button" onClick={() => setFormData({ ...formData, email: 'jeanpierre.callant@example.com' })} style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Owner</button>
                <button type="button" onClick={() => setFormData({ ...formData, email: 'michaelvh89@hotmail.com' })} style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Renter</button>
                <button type="button" onClick={() => setFormData({ ...formData, email: 'mvh@allroundworks.com' })} style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Contractor</button>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {!isRegister && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Demo password: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>demo123</code>
                <button type="button" onClick={() => setFormData({ ...formData, password: 'demo123' })} style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '11px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Fill</button>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          {isRegister ? (
            <>Already have an account? <a href="#" onClick={() => setIsRegister(false)}>Login</a></>
          ) : (
            <>Don't have an account? <a href="#" onClick={() => setIsRegister(true)}>Register</a></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;


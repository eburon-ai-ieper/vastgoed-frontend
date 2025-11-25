import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MaintenanceRequests from './components/MaintenanceRequests';
import CreateRequest from './components/CreateRequest';
import RequestDetail from './components/RequestDetail';
import SelectContractor from './components/SelectContractor';
import ScheduleAppointment from './components/ScheduleAppointment';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';
import { getAuthToken, setAuthToken, removeAuthToken } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Decode token to get user info (simple base64 decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role
        });
      } catch (e) {
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setAuthToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          {/* Public routes (no auth required) */}
          <Route path="/select-contractor/:token" element={<SelectContractor />} />
          <Route path="/schedule-appointment/:token" element={<ScheduleAppointment />} />
          
          {/* Protected routes (require auth) */}
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/requests" element={<MaintenanceRequests user={user} />} />
              <Route path="/requests/new" element={<CreateRequest user={user} />} />
              <Route path="/requests/:id" element={<RequestDetail user={user} />} />
              <Route path="/notifications" element={<Notifications user={user} />} />
            </>
          ) : (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


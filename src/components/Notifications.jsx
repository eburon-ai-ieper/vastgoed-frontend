import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Notifications {unreadCount > 0 && <span style={{ background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '14px' }}>{unreadCount}</span>}</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-secondary">
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{
                opacity: notification.is_read ? 0.7 : 1,
                borderLeft: notification.is_read ? '3px solid #ccc' : '3px solid #007bff',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (!notification.is_read) {
                  markAsRead(notification.id);
                }
                if (notification.related_request_id) {
                  window.location.href = `/requests/${notification.related_request_id}`;
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: notification.is_read ? '#666' : '#000' }}>
                    {notification.title}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{notification.message}</p>
                  <small style={{ color: '#999' }}>
                    {new Date(notification.created_at + 'Z').toLocaleString()}
                  </small>
                </div>
                {!notification.is_read && (
                  <span style={{ background: '#007bff', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;


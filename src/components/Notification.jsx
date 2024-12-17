// src/components/Notification.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Notification = () => {
  const { notification, hideNotification } = useAppContext();

  if (!notification.isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white ${
        notification.type === 'success'
          ? 'bg-green-500'
          : notification.type === 'error'
          ? 'bg-red-500'
          : notification.type === 'warning'
          ? 'bg-yellow-500'
          : 'bg-blue-500'
      }`}
      role="alert"
      onClick={hideNotification}
    >
      {notification.message}
    </div>
  );
};

export default Notification;

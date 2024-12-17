import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, variant = 'info', onClose }) => {
  const AUTO_DISMISS_TIME = 10000; // Default auto-dismiss time in milliseconds

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, AUTO_DISMISS_TIME);

      return () => clearTimeout(timer); // Cleanup timer on unmount or message change
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <Alert 
      variant={variant} 
      onClose={onClose} 
      dismissible 
      aria-live="polite" 
      className="fade show"
    >
      {message}
    </Alert>
  );
};

export default Notification;

// components/Notification.js
import React from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, variant, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default Notification;

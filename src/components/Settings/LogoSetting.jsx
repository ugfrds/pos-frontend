import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Notification from '../Notification';

const LogoSetting = ({ logo, onLogoChange }) => {
    const [error, setError] = useState('');
    const MAX_FILE_SIZE_MB = 1; // Maximum file size in MB
    const MAX_DIMENSIONS = 300; // Maximum width/height in pixels
    const [notification, setNotification] = useState({ message: '', variant: '' });

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
            setNotification({ message: `Logo file size must be less than ${MAX_FILE_SIZE_MB} MB.`, variant: 'danger' });
            return;
        }

        // Validate image dimensions
        const img = new Image();
        img.onload = () => {
            if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
             setNotification({ message: `Logo dimensions must be at most ${MAX_DIMENSIONS}px x ${MAX_DIMENSIONS}px.`, variant: 'danger' });
    
            } else {
                setError('');
                onLogoChange(file);
            }
        };
        img.src = URL.createObjectURL(file);
    };

    return (
        <Form.Group>
            <Form.Label>Business Logo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleLogoUpload} />
            {logo && !error && <p className="mt-2">Selected: {logo.name}</p>}
            <Notification
                message={notification.message}
                variant={notification.variant}
                onClose={() => setNotification({ message: '', variant: '' })}
            />
        </Form.Group>
    );
};

export default LogoSetting;

import React from 'react';
import { Form } from 'react-bootstrap';

const ContactSetting = ({ phoneNumber, onPhone }) => {
    return (
        <Form.Group>
            <Form.Label>Phone Number </Form.Label>
            <Form.Control 
                type="number" 
                value={phoneNumber} 
                onChange={(e) => onPhone(e.target.value)} 
            />
        </Form.Group>
    );
};

export default ContactSetting;

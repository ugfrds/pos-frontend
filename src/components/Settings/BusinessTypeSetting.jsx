import React from 'react';
import { Form } from 'react-bootstrap';

const BusinessTypeSetting = ({ businessType, onBusinessTypeChange }) => {
    return (
        <Form.Group>
            <Form.Label>Business Type</Form.Label>
            <Form.Select
                value={businessType}
                onChange={(e) => onBusinessTypeChange(e.target.value)}
            >
                <option value="">Select Business Type</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Bar">Bar</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
            </Form.Select>
        </Form.Group>
    );
};

export default BusinessTypeSetting;

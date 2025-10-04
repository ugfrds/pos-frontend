import React from 'react';
import { Form } from 'react-bootstrap';

const LocationSetting = ({ location, onLocationChange }) => {
    const handleChange = (e) => {
        onLocationChange(e.target.value);
    };

    return (
        <div>
            <Form.Group>
                <Form.Label className='fw-bold'>Location Address</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your business location"
                    value={location}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
    );
};

export default LocationSetting;

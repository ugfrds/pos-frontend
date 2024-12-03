import React from 'react';
import { Form } from 'react-bootstrap';

const TaxSetting = ({ taxPercentage, onTaxChange }) => {
    return (
        <Form.Group>
            <Form.Label>Tax Percentage (%)</Form.Label>
            <Form.Control 
                type="number" 
                value={taxPercentage} 
                onChange={(e) => onTaxChange(parseFloat(e.target.value))} 
            />
        </Form.Group>
    );
};

export default TaxSetting;

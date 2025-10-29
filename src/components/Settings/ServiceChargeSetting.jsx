import React from 'react';
import { Form } from 'react-bootstrap';

const ServiceChargeSetting = ({ serviceCharge, serviceChargeEnabled, onServiceChargeChange, onToggleServiceCharge }) => {
    return (
        <Form.Group>
            <Form.Check 
                type="switch" 
                id="serviceChargeSwitch" 
                label="Enable Service Charge" 
                checked={serviceChargeEnabled} 
                onChange={(e) => onToggleServiceCharge(e.target.checked)} 
                className='fw-bold'
            />
            {serviceChargeEnabled && (
                <Form.Control 
                    type="number" 
                    value={serviceCharge} 
                    onChange={(e) => onServiceChargeChange(parseFloat(e.target.value))} 
                    placeholder="Service Charge (%)"
                />
            )}
        </Form.Group>
    );
};

export default ServiceChargeSetting;

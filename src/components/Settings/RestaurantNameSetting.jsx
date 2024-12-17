
import { Form } from 'react-bootstrap';

const RestaurantNameSetting = ({ name, onNameChange }) => {
    return (
        <Form.Group>
            <Form.Label className='fw-bold'>Business Name</Form.Label>
            <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => onNameChange(e.target.value)} 
            />
        </Form.Group>
    );
};

export default RestaurantNameSetting;

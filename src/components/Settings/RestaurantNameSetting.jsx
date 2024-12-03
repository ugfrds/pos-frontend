
import { Form } from 'react-bootstrap';

const RestaurantNameSetting = ({ name, onNameChange }) => {
    return (
        <Form.Group>
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => onNameChange(e.target.value)} 
            />
        </Form.Group>
    );
};

export default RestaurantNameSetting;

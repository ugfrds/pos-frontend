
import { Form } from 'react-bootstrap';

const ReceiptNotesSetting = ({ notes, onNotesChange }) => {
    return (
        <Form.Group>
            <Form.Label>Receipt Notes</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} 
                value={notes} 
                onChange={(e) => onNotesChange(e.target.value)} 
            />
        </Form.Group>
    );
};

export default ReceiptNotesSetting;

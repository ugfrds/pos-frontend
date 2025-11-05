
import { ListGroup, Button } from 'react-bootstrap';

const UserCard = ({ user, onEdit, onDelete }) => {
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
                <h5>{user.username}</h5>
                <p className="text-muted">{user.email}</p>
                <p className="text-muted">Role: {user.role}</p>
                <p className="text-muted">Status: {user.isLocked ? 'Locked' : 'Active'}</p>
            </div>
            <div>
                <Button variant="warning" onClick={onEdit} className="me-2">
                    Edit
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
            </div>
        </ListGroup.Item>
    );
};

export default UserCard;

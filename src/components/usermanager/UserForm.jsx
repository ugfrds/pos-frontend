import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const UserForm = ({ user, onClose, onSave }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [error, setError] = useState('');

    const roles = ['Admin', 'Manager', 'Cashier', 'Waiter', 'Supervisor'];

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setPassword(user.password); // Keep password field for editing
            setRole(user.role);
            setIsLocked(user.isLocked);
        } else {
            // Reset form for adding new user
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
            setIsLocked(false);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user) {
            // Editing existing user
            if (!username || !email || !role) {
                setError('Please fill all required fields.');
                return;
            }
            onSave({ id: user.id, username, email, password, role, isLocked });
        } else {
            // Adding new user
            if (!email || !role) {
                setError('Please fill email and role.');
                return;
            }
            onSave({ username, email, password, role, isLocked });
        }

        setError('');
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{user ? 'Edit User' : 'Add User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {user && (
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={user !== null}
                                disabled={user === null}
                            />
                        </Form.Group>
                    )}
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave empty to keep current password"
                        />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Select role</option>
                            {roles.map((roleOption, index) => (
                                <option key={index} value={roleOption}>{roleOption}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formLock">
                        <Form.Check
                            type="checkbox"
                            label="Lock user"
                            checked={isLocked}
                            onChange={(e) => setIsLocked(e.target.checked)}
                        />
                    </Form.Group>
                    <Button variant="secondary" onClick={onClose} className="me-2">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {user ? 'Update' : 'Add'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UserForm;

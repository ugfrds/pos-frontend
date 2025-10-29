/*

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, Pagination, Alert } from 'react-bootstrap';
import UserForm from '../../components/usermanager/UserForm';
import UserCard from '../../components/usermanager/UserCard';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api'; // Import updated API functions

const UserManagementPage = () => {
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const itemsPerPage = 4;

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        const result = userList.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(result);
    }, [searchTerm, userList]);

    const getUsers = async () => {
        try {
            const users = await fetchUsers();
            setUserList(users);
        } catch (error) {
            setError('Failed to load users.');
        }
    };

    const handleAddUser = () => {
        setCurrentUser(null);
        setShowForm(true);
    };

    const handleEditUser = (user) => {
        setCurrentUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUserList(userList.filter(user => user.id !== id));
        } catch (error) {
            setError('Failed to delete user.');
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setCurrentUser(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSaveUser = async (user) => {
        try {
            if (currentUser) {
                // Edit existing user
                const updatedUser = await updateUser(user.id, user);
                setUserList(userList.map(u => (u.id === updatedUser.id ? updatedUser : u)));
            } else {
                // Add new user
                const newUser = await createUser(user);
                setUserList([...userList, newUser]);
            }
            handleFormClose();
        } catch (error) {
            setError('Failed to save user.');
        }
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="justify-content-center mb-4">
                <Col xs="auto">
                    <h1 className="main-heading">Staff Management</h1>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Button variant="primary" onClick={handleAddUser}>Add User</Button>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
                        {currentUsers.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={() => handleEditUser(user)}
                                onDelete={() => handleDeleteUser(user.id)}
                            />
                        ))}
                    </ListGroup>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Pagination>
                        {pageNumbers.map(number => (
                            <Pagination.Item
                                key={number}
                                active={number === currentPage}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
            {showForm && (
                <UserForm
                    user={currentUser}
                    onClose={handleFormClose}
                    onSave={handleSaveUser}
                />
            )}
        </Container>
    );
};

export default UserManagementPage;
*/
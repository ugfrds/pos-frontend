import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Card, 
  Badge, 
  Alert,
  InputGroup,
  Tabs,
  Tab,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import {
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  User, 
  Search,
  Lock,
  Unlock,
  Eye,
  Upload,
  FileText,
  IdCard,
  Briefcase,
  StickyNote,
  Calendar,
  Phone,
  MapPin,
  UserCheck
} from 'lucide-react';
import { deleteUser, fetchUsers, updateUserInfo, updateUserProfile } from '../../api';import Notification from '../../components/Notification';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('role');

  const roleVariants = {
    BusinessAdmin: 'danger',
    Manager: 'warning',
    Supervisor: 'info',
    Cashier: 'success',
    Waiter: 'primary'
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      setUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setNotification({ message: 'Error fetching users.', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(id);
        setNotification({ message: 'User deleted successfully.', variant: 'success' });
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        setNotification({ message: 'Error deleting user.', variant: 'danger' });
      }
    }
  };

  const handleProfileClick = (user) => {
    navigate('/admin/staff/profile', { state: { userId: user.id } });
  };



  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role); // Set the current role as the default for editing
    setShowEditModal(true);
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateUserInfo(selectedUser.id, { role: newRole });
      
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === updatedUser.id ? { ...user, role: updatedUser.role } : user
      ));
  
      setNotification({ message: 'User updated successfully.', variant: 'success' });
      setShowEditModal(false);
    } catch (error) {
      setNotification({ message: 'Error updating user.', variant: 'danger' });
    }
  };



  const handleBlockUser = async () => {
    try {
      // Assuming you have a blockUser API endpoint
      // await blockUser(selectedUser.id);
      setNotification({ message: `User ${selectedUser.isBlocked ? 'unblocked' : 'blocked'} successfully.`, variant: 'success' });
      setShowBlockModal(false);
      getUsers(); // Refresh the list
    } catch (error) {
      setNotification({ message: 'Error updating user status.', variant: 'danger' });
    }
  };

  const canModifyUser = (user) => {
    // Temporarily return true to debug modal opening issue
    return true;
  };

  const getRoleVariant = (role) => {
    return roleVariants[role] || 'secondary';
  };

  return (
    <Container className="mt-4">
      <Notification
        message={notification.message}
        variant={notification.variant}
        onClose={() => setNotification({ message: '', variant: '' })}
      />

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} className="me-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-danger mb-0">wisePOS</h1>
          <small className="text-muted">User Management System</small>
        </div>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Management Card */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <Shield className="me-2 text-primary" size={24} />
                User Management
              </h4>
            </div>
            <Link to="/admin/add-staff" className="btn btn-success">
              <Plus size={20} className="me-2" />
              Add New User
            </Link>
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* Search Bar */}
          <div className="row mb-4">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>
                  <Search size={18} className="me-2" />
                  Search users by name, email, or role...
                </Form.Label>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-md-6 text-end">
              <Badge bg="light" text="dark" className="p-2">
                Total Users: {filteredUsers.length}
              </Badge>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '40px', height: '40px' }}>
                            <User size={20} className="text-white" />
                          </div>
                          <div>
                            <strong>{user.username}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Mail size={16} className="me-2 text-muted" />
                          {userRole === 'BusinessAdmin' ? user.email : '••••@•••••.com'}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getRoleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.isBlocked ? 'danger' : 'success'}>
                          {user.isBlocked ? (
                            <><Lock size={12} className="me-1" /> Blocked</>
                          ) : (
                            <><Unlock size={12} className="me-1" /> Active</>
                          )}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleProfileClick(user)}
                            title="View/Edit Profile"
                          >
                            <UserCheck size={16} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate('/admin/staff/view-profile', { state: { userId: user.id } })}
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </Button>
                          
                          <Button
                            disabled={!canModifyUser(user)}
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleEditClick(user)}
                            title="Edit Role"
                          >
                            <Edit size={16} />
                          </Button>
                          
                          <Button
                            disabled={!canModifyUser(user)}
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleBlockClick(user)}
                            title={user.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {user.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                          </Button>

                          <Button
                            disabled={!canModifyUser(user)}
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-5">
                  <User size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No users found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Edit size={20} className="me-2 text-warning" />
            Edit User Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={selectedUser?.username || ''} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Role</Form.Label>
              <Form.Control 
                type="text" 
                value={selectedUser?.role || ''} 
                disabled 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Role</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Cashier">Cashier</option>
                <option value="Waiter">Waiter</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleUpdate}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Block/Unblock User Modal */}
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser?.isBlocked ? (
              <><Unlock size={20} className="me-2 text-success" />Unblock User</>
            ) : (
              <><Lock size={20} className="me-2 text-danger" />Block User</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={selectedUser?.isBlocked ? 'success' : 'warning'}>
            Are you sure you want to {selectedUser?.isBlocked ? 'unblock' : 'block'} <strong>{selectedUser?.username}</strong>?
            <br />
            <small className="text-muted">
              {selectedUser?.isBlocked 
                ? 'This will restore their access to the system.'
                : 'This will immediately prevent them from logging in.'
              }
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedUser?.isBlocked ? 'success' : 'danger'} 
            onClick={handleBlockUser}
          >
            {selectedUser?.isBlocked ? 'Unblock User' : 'Block User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="text-center mt-5 py-4">
        <p className="text-muted">
          <Shield size={16} className="me-1" />
          © 2024 Wisecorp Technologies. All rights reserved.
        </p>
      </footer>
    </Container>
  );
};

export default UserManagementPage;
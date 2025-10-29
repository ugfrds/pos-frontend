import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  deleteUser, fetchUsers,  updateUserInfo } from '../../api';
import Notification from '../../components/Notification'; // Import the Notification component


const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('role');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setNotification({ message: 'User deleted successfully.', variant: 'success' });
        setUsers(users.filter(user => user.id !== id));
        //fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        setNotification({ message: 'Error deleting user.', variant: 'danger' });
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
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
  

  return (
    <div className="container mt-5">
      <Notification
        message={notification.message}
        variant={notification.variant}
        onClose={() => setNotification({ message: '', variant: '' })}
      />

      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="text-center mb-4">
        <h1 className="text-danger">wisePOS</h1>
      </div>

      <h2>Manage Users</h2>
      <Link to="/admin/add-staff" className="btn btn-success mb-3">
        Add New User
      </Link>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{userRole === 'BusinessAdmin' ? user.email : null}</td>
              <td>{user.role}</td>
              <td>
                <button
                  disabled={user.role === 'BusinessAdmin' || user.role ===userRole} // Disable for current user and business admin
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  disabled={user.role === 'BusinessAdmin' || user.role ===userRole}
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="form-control"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="Manager">Manager</option>
                      <option value="Supervisor">Supervisor</option>
                     <option value="Cashier">Cashier</option>
                     <option value="Waiter">Waiter</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center mt-5">
        <p className="text-danger">© 2024 Wisecorp Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserManagementPage;

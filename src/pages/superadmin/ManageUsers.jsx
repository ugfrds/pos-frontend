import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAdmin, getAllAdmins, updateAdmin } from '../../api';
import Notification from '../../components/Notification'; // Import the Notification component

const ManageUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const admins = await getAllAdmins();
      setAdmins(admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteAdmin(id);
        setNotification({ message: 'User deleted successfully.', variant: 'success' });
        fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        setNotification({ message: 'Error deleting user.', variant: 'danger' });
      }
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setNewRole(admin.role);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateAdmin(selectedAdmin.id, { role: newRole });
      setNotification({ message: 'User updated successfully.', variant: 'success' });
      setShowEditModal(false);
      fetchUsers(); // Refresh the list after updating
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
      <Link to="/superadmin/add-user" className="btn btn-success mb-3">
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
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEditClick(admin)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(admin.id)}
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
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
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

export default ManageUsers;

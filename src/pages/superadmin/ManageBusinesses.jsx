import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBusinesses, deleteBusiness } from '../../api';
import Notification from '../../components/Notification'; // Import your custom notification component
import { Modal, Button } from 'react-bootstrap';

const ManageBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const navigate = useNavigate();

  // Fetch businesses from the server when the component mounts
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const businesses = await getAllBusinesses();
      setBusinesses(businesses);
      console.log('businesses:', businesses);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(businessToDelete.id);
      setNotification({ message: 'Business deleted successfully.', variant: 'success' });
      setShowConfirmDelete(false);
      setNotification({ message: 'Business deleted successfully.', variant: 'success' });
      fetchBusinesses(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete business:', error);
      Notification.error('Failed to delete business');
    }
  };

  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedBusiness) => {
    try {
      // Assuming you have an API call to update the business
      // await updateBusiness(updatedBusiness);
      Notification.success('Business updated successfully');
      setShowEditModal(false);
      fetchBusinesses(); // Refresh the list
    } catch (error) {
      console.error('Failed to update business:', error);
      Notification.error('Failed to update business');
    }
  };

  const handleConfirmDelete = (business) => {
    setBusinessToDelete(business);
    setShowConfirmDelete(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {/* Logo */}
      <div className="text-center mb-4">
        <h1 className="text-danger">wisePOS</h1>
      </div>

      <h2>Manage Businesses</h2>
      <Link to="/superadmin/add-business" className="btn btn-success mb-3">
        Add New Business
      </Link>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Owner</th>
            <th>Number of Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id}>
              <td>{business.name}</td>
              <td>{business.owner ? business.owner.name : 'N/A'}</td>
              <td>{business.employees ? business.employees.length : 0}</td>
              <td>
                <Button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(business)}
                >
                  Edit
                </Button>
                <Button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleConfirmDelete(business)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Business Modal */}
      <Modal show={showEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Implement your business edit form here */}
          {/* For simplicity, we assume that you have a form component that handles business updates */}
          {/* <BusinessEditForm
            business={selectedBusiness}
            onUpdate={handleUpdate}
            onCancel={closeModal}
          /> */}
          <p>Form to edit business will be here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdate(selectedBusiness)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this business?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p className="text-danger">© 2024 Wisecorp Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ManageBusinesses;

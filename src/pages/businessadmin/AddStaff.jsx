import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {createUser} from '../../api';
import Notification from '../../components/Notification'; 



const AddStaff = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); // Default role
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const navigate = useNavigate();
  

  // logic to save the new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const data = await createUser(email, role);
      console.log('User created successfully:', data);
      setNotification({ message: `${role} added successfully.`, variant: 'success' });
      
      
  } catch (error) {
      console.error('Failed to create User:', error);
      
  }
  setEmail('');
  setName('');
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

      <h2 className="mb-4">Add New Staff Member</h2>
      <Notification
        message={notification.message}
        variant={notification.variant}
        onClose={() => setNotification({ message: '', variant: '' })}
      />
      <form onSubmit={handleAddUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter user's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            className="form-select"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >  
          <option value=""> select role</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Cashier">Cashier</option>
            <option value="Waiter">Waiter</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
      
      {/* Footer */}
      <footer className="text-center mt-5">
        <p className="text-danger">&copy; 2024 Wisecorp Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddStaff;

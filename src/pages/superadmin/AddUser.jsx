import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {createAdmin} from '../../api';




const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); // Default role
  const navigate = useNavigate();


  // logic to save the new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const data = await createAdmin(email, role);
      console.log('Admin created successfully:', data);
      alert (`${role} created successfully`);
      
  } catch (error) {
      console.error('Failed to create Admin:', error);
      
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

      <h2 className="mb-4">Add New User</h2>
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
            <option value="Superadmin">Superadmin</option>
            <option value="Business Owner/admin">Business Owner/Admin</option>
            <option value="Sys Supervisor">Sys Supervisor</option>
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

export default AddUser;

// src/layouts/userLayout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Dashboard/Navbar'; // Ensure the correct path

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

export default UserLayout;

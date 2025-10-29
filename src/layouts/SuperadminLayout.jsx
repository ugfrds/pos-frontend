// src/layouts/SuperadminLayout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Ensure the correct path

const SuperadminLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

export default SuperadminLayout;

// src/layouts/SuperadminLayout.jsx

import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/biz/AdminNavBar'; // Ensure the correct path

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

export default AdminLayout;

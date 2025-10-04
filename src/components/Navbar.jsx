// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logout from'./logout'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/superadmin/dashboard">
          Admin Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/superadmin/manage-users">
                Manage Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/superadmin/manage-businesses">
                Manage Businesses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/superadmin/reports">
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/superadmin/settings">
                Settings
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-light ms-3" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
     

      {/* Main Content */}
      <div className="container mt-5">
        <h2>Welcome, SuperAdmin</h2>
        <p>Choose an action from the navigation bar to manage the system.</p>

        {/* Sample sections, could be pages for user management, etc. */}
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Manage Users</h5>
                <p className="card-text">Create, edit, or delete user accounts.</p>
                <Link to="/superadmin/manage-users" className="btn btn-primary">
                  Go to Users
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Manage Businesses</h5>
                <p className="card-text">Create, edit, or delete businesses.</p>
                <Link to="/superadmin/manage-businesses" className="btn btn-primary">
                  Go to Businesses
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Reports</h5>
                <p className="card-text">View system-wide reports and analytics.</p>
                <Link to="superadmin/reports" className="btn btn-primary">
                  Go to Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

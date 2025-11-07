// // src/components/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import logout from'./logout'

// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/superadmin/dashboard">
//           Admin Dashboard
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link className="nav-link" to="/superadmin/manage-users">
//                 Manage Users
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/superadmin/manage-businesses">
//                 Manage Businesses
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/superadmin/reports">
//                 Reports
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/superadmin/settings">
//                 Settings
//               </Link>
//             </li>
//           </ul>
//           <button className="btn btn-outline-light ms-3" onClick={logout}>Logout</button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/SuperAdminNavbar.jsx
import React, { useState } from 'react';
import { 
  Navbar, 
  Nav, 
  Container, 
  Dropdown, 
  Badge,
  Button,
  Offcanvas
} from 'react-bootstrap';
import {
  BsPersonFill as PersonFill,
  BsBell as Bell,
  BsGear as Gear,
  BsBoxArrowRight as BoxArrowRight,
  BsSpeedometer2 as Speedometer2,
  BsPeople as People,
  BsBuilding as Building,
  BsBarChart as BarChart,
  BsList as List
} from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SuperAdminNavbar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for notifications
  const [notifications] = useState([
    { id: 1, message: 'New user registration', type: 'info', read: false },
    { id: 2, message: 'System backup completed', type: 'success', read: false },
    { id: 3, message: 'High memory usage', type: 'warning', read: true }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: clear localStorage, tokens, etc.
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <>
      <Navbar 
        bg="dark" 
        variant="dark" 
        expand="lg" 
        className="shadow-sm"
        fixed="top"
      >
        <Container fluid>
          {/* Brand/Logo */}
          <Navbar.Brand 
            as={Link}
            to="/superadmin/dashboard" 
            className="d-flex align-items-center fw-bold"
          >
            <Speedometer2 className="me-2" size={24} />
            POS Admin
          </Navbar.Brand>

          {/* Mobile Toggle Button */}
          <Button
            variant="outline-light"
            className="d-lg-none"
            onClick={handleShowOffcanvas}
          >
            <List size={20} />
          </Button>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link}
                to="/superadmin/dashboard"
                className={`d-flex align-items-center ${isActivePath('/superadmin/dashboard') ? 'active' : ''}`}
              >
                <Speedometer2 className="me-1" size={16} />
                Dashboard
              </Nav.Link>

              <Nav.Link 
                as={Link}
                to="/superadmin/manage-users"
                className={`d-flex align-items-center ${isActivePath('/superadmin/manage-users') ? 'active' : ''}`}
              >
                <People className="me-1" size={16} />
                Manage Users
              </Nav.Link>

              <Nav.Link 
                as={Link}
                to="/superadmin/manage-businesses"
                className={`d-flex align-items-center ${isActivePath('/superadmin/manage-businesses') ? 'active' : ''}`}
              >
                <Building className="me-1" size={16} />
                Manage Businesses
              </Nav.Link>

              <Nav.Link 
                as={Link}
                to="/superadmin/reports"
                className={`d-flex align-items-center ${isActivePath('/superadmin/reports') ? 'active' : ''}`}
              >
                <BarChart className="me-1" size={16} />
                Reports
              </Nav.Link>

              <Nav.Link 
                as={Link}
                to="/superadmin/settings"
                className={`d-flex align-items-center ${isActivePath('/superadmin/settings') ? 'active' : ''}`}
              >
                <Gear className="me-1" size={16} />
                Settings
              </Nav.Link>
            </Nav>

            {/* Right-side items */}
            <Nav className="ms-auto d-flex align-items-center">
              {/* Notifications Dropdown */}
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle 
                  variant="dark" 
                  id="notifications-dropdown"
                  className="position-relative border-0"
                >
                  <Bell size={18} />
                  {unreadNotifications > 0 && (
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm" style={{ minWidth: '300px' }}>
                  <Dropdown.Header className="d-flex justify-content-between align-items-center">
                    <span>Notifications</span>
                    <Badge bg="primary" pill>
                      {notifications.length}
                    </Badge>
                  </Dropdown.Header>
                  
                  {notifications.map(notification => (
                    <Dropdown.Item 
                      key={notification.id}
                      className={`d-flex align-items-start py-2 ${!notification.read ? 'bg-light' : ''}`}
                    >
                      <div className="flex-grow-1">
                        <div className="small">{notification.message}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {notification.type}
                        </div>
                      </div>
                      {!notification.read && (
                        <span className="ms-2">
                          <Badge bg="primary" pill style={{ fontSize: '0.5rem' }}>
                            New
                          </Badge>
                        </span>
                      )}
                    </Dropdown.Item>
                  ))}
                  
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-center text-primary">
                    View All Notifications
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* User Profile Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="dark" 
                  id="user-dropdown"
                  className="d-flex align-items-center border-0"
                >
                  <PersonFill className="me-2" size={18} />
                  SuperAdmin
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm">
                  <Dropdown.Header>
                    <div className="fw-bold">Super Admin</div>
                    <small className="text-muted">admin@possystem.com</small>
                  </Dropdown.Header>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item as={Link} to="/superadmin/profile" className="d-flex align-items-center">
                    <PersonFill className="me-2" size={16} />
                    My Profile
                  </Dropdown.Item>
                  
                  <Dropdown.Item as={Link} to="/superadmin/settings" className="d-flex align-items-center">
                    <Gear className="me-2" size={16} />
                    Settings
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item 
                    className="d-flex align-items-center text-danger"
                    onClick={handleLogout}
                  >
                    <BoxArrowRight className="me-2" size={16} />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={handleCloseOffcanvas}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Speedometer2 className="me-2" />
            Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/superadmin/dashboard" onClick={handleCloseOffcanvas} className="d-flex align-items-center py-3">
              <Speedometer2 className="me-2" size={18} />
              Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/superadmin/manage-users" onClick={handleCloseOffcanvas} className="d-flex align-items-center py-3">
              <People className="me-2" size={18} />
              Manage Users
            </Nav.Link>

            <Nav.Link as={Link} to="/superadmin/manage-businesses" onClick={handleCloseOffcanvas} className="d-flex align-items-center py-3">
              <Building className="me-2" size={18} />
              Manage Businesses
            </Nav.Link>

            <Nav.Link as={Link} to="/superadmin/reports" onClick={handleCloseOffcanvas} className="d-flex align-items-center py-3">
              <BarChart className="me-2" size={18} />
              Reports
            </Nav.Link>

            <Nav.Link as={Link} to="/superadmin/settings" onClick={handleCloseOffcanvas} className="d-flex align-items-center py-3">
              <Gear className="me-2" size={18} />
              Settings
            </Nav.Link>

            <hr />

            <Nav.Link 
              className="d-flex align-items-center py-3 text-danger"
              onClick={handleLogout}
            >
              <BoxArrowRight className="me-2" size={18} />
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '76px' }}></div>
    </>
  );
};

export default SuperAdminNavbar;

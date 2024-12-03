import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/AdminNavBar.css';  // Import the CSS file for styling
import logout from '../logout'; 

const NavBar = () => {
  const location = useLocation();  // Get current location

  // Function to check if the current path matches the nav item
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center">
          {/*<img src="/path/to/logo.png" alt="Logo" className="logo me-2" />*/}
          <span className="fw-bold fs-4">Admin Dashboard</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link href = "/dashboard" className="fs-5">
              Main Dashboard
            </Nav.Link>
            {!isActive('/admin/orderhistori') && (
              <Nav.Link as={Link} to="/admin/orderhistori" className="fs-5">
                Order History
              </Nav.Link>
            )}
            {!isActive('/admin/manage-menu') && (
              <Nav.Link as={Link} to="/admin/manage-menu" className="fs-5">
                Manage Menu
              </Nav.Link>
            )}
            {!isActive('/admin/reports') && (
              <Nav.Link as={Link} to="/admin/reports" className="fs-5">
                Reports
              </Nav.Link>
            )}
            {!isActive('/admin/staff') && (
              <Nav.Link as={Link} to="/admin/staff" className="fs-5">
                Staff Management
              </Nav.Link>
            )}
          </Nav>
          <div className="d-flex align-items-center">
            <Button as={Link} to="/admin/settings" variant="outline-light" className="me-2">
              Settings
            </Button>
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

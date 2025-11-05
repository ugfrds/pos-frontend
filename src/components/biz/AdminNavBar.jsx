import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/AdminNavbar.css'; // Import the CSS file for styling
import logout from '../logout'; 

const NavBar = () => {
  const location = useLocation(); // Get current location

  // Function to check if the current path matches the nav item
  const isActive = (path) => location.pathname === path;

  // Function to handle Inventory & Reports clicks
  const handleInventoryReportsClick = () => {
    const authToken = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
    if (authToken) {
      const inventoryUrl = `https://wisepos-inventory.vercel.app/inventory?P=${encodeURIComponent(
        authToken
      )}`;
      window.open(inventoryUrl, '_blank'); // Open in a new tab
    } else {
      alert('Authorization token not found. Please log in again.'); // Error handling
    }
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center">
          <span className="fw-bold fs-4">Admin Dashboard</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" className="fs-5">
              Main Dashboard
            </Nav.Link>
            {!isActive('/admin/orderhistory') && (
              <Nav.Link as={Link} to="/admin/orderhistory" className="fs-5">
                Order History
              </Nav.Link>
            )}
            {!isActive('/admin/manage-menu') && (
              <Nav.Link as={Link} to="/admin/manage-menu" className="fs-5">
                Manage Menu
              </Nav.Link>
            )}
            {!isActive('/admin/staff') && (
              <Nav.Link as={Link} to="/admin/staff" className="fs-5">
                Manage Staff
              </Nav.Link>
            )}
            {!isActive('/admin/reports') && (
              <Nav.Link as={Link} to="/admin/reports" className="fs-5">
                Reports & Inventory
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

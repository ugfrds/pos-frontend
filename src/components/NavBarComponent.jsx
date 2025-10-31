import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  Button,
  Offcanvas,
} from "react-bootstrap";
import {
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";

export default function NavBarComponent() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);
  const handleOffcanvasClose = () => setShowOffcanvas(false);

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            ADIMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleOffcanvasToggle}>
            <FaBars />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/manage-inventory">Manage Inventory</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#notifications">
                <div className="position-relative">
                  <FaBell size={24} />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                </div>
              </Nav.Link>
              <NavDropdown
                title={<Image src="" roundedCircle width={32} height={32} />}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#profile">
                  <FaUserCircle className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings">
                  <FaCog className="me-2" /> Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
              <Navbar.Text className="ms-2">ADMI ZAKARYAE</Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/manage-inventory" onClick={handleOffcanvasClose}>Manage Inventory</Nav.Link>
            <Nav.Link href="#profile" onClick={handleOffcanvasClose}><FaUserCircle className="me-2" />Profile</Nav.Link>
            <Nav.Link href="#settings" onClick={handleOffcanvasClose}><FaCog className="me-2" />Settings</Nav.Link>
            <Nav.Link href="#logout" onClick={handleOffcanvasClose}><FaSignOutAlt className="me-2" />Logout</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}


{
  /* <Grid item md={7}>
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      width: "50%",
                      mx: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search "
                      inputProps={{ "aria-label": "search" }}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <Search />
                    </IconButton>
                  </Paper>
                </Grid> */
}

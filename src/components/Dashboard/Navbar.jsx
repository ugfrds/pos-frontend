import { useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // For routing and getting the current location
import '../styles/NavBar.css';

const NavBar = () => {
    const [activeLink, setActiveLink] = useState(''); // Default active link
    const location = useLocation(); // Get the current location

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <Navbar className="custom-navbar" expand="lg" sticky="top">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        {location.pathname !== '/dashboard' && (
                            <Nav.Link 
                                as={Link} 
                                to="/dashboard" 
                                onClick={() => handleLinkClick('/dashboard')} 
                                className={activeLink === '/dashboard' ? 'active' : ''}
                            >
                                Dashboard
                            </Nav.Link>
                        )}
                        {location.pathname !== '/pending' && (
                            <Nav.Link 
                                as={Link} 
                                to="/pending" 
                                onClick={() => handleLinkClick('/orders')} 
                                className={activeLink === '/orders' ? 'active' : ''}
                            >
                                Orders
                            </Nav.Link>
                        )}
                        {location.pathname !== '/tables' && (
                            <Nav.Link 
                                as={Link} 
                                to="/tables" 
                                onClick={() => handleLinkClick('/tables')} 
                                className={activeLink === '/tables' ? 'active' : ''}
                            >
                                Tables
                            </Nav.Link>
                        )}
                        {location.pathname !== '/menu' && (
                            <Nav.Link 
                                as={Link} 
                                to="/menu" 
                                onClick={() => handleLinkClick('/menu')} 
                                className={activeLink === '/menu' ? 'active' : ''}
                            >
                                Menu
                            </Nav.Link>
                        )}
                       { /*
                        {location.pathname !== '/reports' && (
                            <Nav.Link 
                                as={Link} 
                                to="/reports" 
                                onClick={() => handleLinkClick('/reports')} 
                                className={activeLink === '/reports' ? 'active' : ''}
                            >
                                Reports
                            </Nav.Link>
                        )}
                        */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;

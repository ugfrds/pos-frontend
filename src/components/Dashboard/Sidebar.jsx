import { useState } from 'react';
import { Nav, Collapse, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaTachometerAlt, FaPlus, FaTable, FaUtensils, FaUser } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); // Sidebar starts open by default
    const [showSidebar, setShowSidebar] = useState(true); // Toggle sidebar visibility

    const handleToggle = () => setIsOpen(!isOpen); // Handle dropdown toggle

    return (
        <>
            <Button
                className="d-md-none position-fixed top-0 start-0 m-3 z-index-1"
                variant="primary"
                onClick={() => setShowSidebar(!showSidebar)}
            >
                {showSidebar ? 'Close' : 'Menu'}
            </Button>

            <aside
                className={`bg-dark text-white p-4 vh-100 ${showSidebar ? 'd-block' : 'd-none'} d-md-block`}
                style={{ width: '250px', transition: 'transform 0.3s ease' }}
            >
                <Nav className="flex-column">
                    <Nav.Link
                        onClick={handleToggle}
                        className="text-white d-flex justify-content-between align-items-center fs-4 fw-bold mb-3"
                        style={{ cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                        Manage
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </Nav.Link>
                    <Collapse in={isOpen}>
                        <div>
                            <Nav.Link as={Link} to="/pending" className="text-white d-flex align-items-center mb-2 nav-item">
                                <FaTachometerAlt className="me-2" />
                                Active Orders
                            </Nav.Link>
                            
                            <Nav.Link as={Link} to="/admin/manage-menu" className="text-white d-flex align-items-center mb-2 nav-item">
                                <FaUtensils className="me-2" />
                                Manage Menu
                            </Nav.Link>
                            <Nav.Link as={Link} to="/admin/staff" className="text-white d-flex align-items-center mb-2 nav-item">
                                <FaUser className="me-2" />
                                Staff Management
                            </Nav.Link>
                            <Nav.Link as={Link} to="/admin/orderhistory" className="text-white d-flex align-items-center mb-2 nav-item">
                                <FaTable className="me-2" />
                                Order History
                            </Nav.Link>

                            <Nav.Link as={Link} to="/admin/dashboard" className="text-white d-flex align-items-center mb-2 nav-item">
                                <FaPlus className="me-2" />
                                Admin Dashboard
                            </Nav.Link>
                            
                        </div>
                    </Collapse>
                </Nav>
            </aside>
        </>
    );
};

export default Sidebar;

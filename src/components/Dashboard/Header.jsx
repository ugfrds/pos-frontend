import { useContext, useState } from 'react';
import { Navbar, Container, Nav ,Button} from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Importing a user icon
import { UserBusinessContext } from '../../context/UserBusinessContext';
import logout from'../logout' // Import the context 
//import ShiftButton from '../ShiftButton';

const Header = () => {
    const { user, business } = useContext(UserBusinessContext); // Access user and business from context
    const [showLogout, setShowLogout] = useState(false);
    const currentDateTime = new Date().toLocaleString();

    return (
        <Navbar bg="dark" variant="dark">
            <Container className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                <Navbar.Brand 
                    href="/" 
                    className="text-center" 
                    style={styles.brand}
                >    
                    {business.settings.name ? `${business.settings.name} POS` : 'Restaurant POS'}
                </Navbar.Brand>
                <div className="text-center" style={styles.date}>
                    {currentDateTime}
                </div>
                <Nav className="d-flex justify-content-center align-items-center" style={styles.userInfo}>
                    <FaUserCircle style={styles.icon} />
                    <Nav.Link 
                        href="#profile" 
                        className="text-center"
                        style={styles.username}
                        onClick={() => setShowLogout(!showLogout)}
                    >
                        {user.username ? user.username : 'Guest'}
                    </Nav.Link>
                    {showLogout && (
                            <Button 
                                variant="outline-light" 
                                size="sm" 
                                onClick={logout } 
                                style={styles.logoutButton}
                            >
                                Logout
                            </Button>
                            
                        )}
                </Nav>
                {/* <ShiftButton /> */}
            </Container>
        </Navbar>
    );
};

const styles = {
    brand: {
        fontSize: '2rem', // Larger font size for the heading
        fontWeight: 'bold',
        color: '#fff',
    },
    date: {
        fontSize: '1rem', // Font size for date and time
        color: '#ccc',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        fontSize: '1.5rem', // Size of the user icon
        color: '#ccc',
        marginRight: '8px',
    },
    username: {
        fontSize: '1rem',
        color: '#ccc',
    },
};

export default Header;

// src/components/Footer.js
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-4 p-3">
            <Container>
                <Row>
                    <Col md="12" className="text-center">
                    <p className="mb-0">&copy; {new Date().getFullYear()} Wisecorp Technologies Ltd. All rights reserved.</p>
                    <small>Developed By: <a 
                     style={{  color: '#6c757d' }}
                     href="https://ugfrds.github.io/portfolio" target="_blank">Justlikewiseman</a></small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;

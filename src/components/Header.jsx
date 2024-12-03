// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = ({ restaurantName }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#">Restaurant POS</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#tables">Tables</Nav.Link>
                    <Nav.Link href="#orders">Orders</Nav.Link>
                    <Nav.Link href="#menu">Menu</Nav.Link>
                    <Nav.Link href="#reports">Reports</Nav.Link>
                </Nav>
                <div className="text-white ms-auto">
                    <span><strong>Restaurant:</strong> {restaurantName}</span><br />
                    <span><strong>Date:</strong> {currentDateTime.split(',')[0]}</span><br />
                    <span><strong>Time:</strong> {currentDateTime.split(',')[1]}</span>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;

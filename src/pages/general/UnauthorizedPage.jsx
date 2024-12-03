import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard'); // Navigate to the previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <Container className="text-center" style={{ marginTop: '50px' }}>
      <Row>
        <Col>
          <h1 className="display-4">Unauthorized Access</h1>
          <p className="lead">Sorry, you don't have permission to view this page.</p>
          <Button variant="primary" onClick={handleGoBack} className="me-2">
            Go Back
          </Button>
          <Button variant="secondary" onClick={handleGoHome}>
            Go to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;

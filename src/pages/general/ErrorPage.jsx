import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <Row>
        <Col>
          <div className="mb-4">
            <h1 className="display-1 text-danger">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="lead">Sorry, the page you are looking for does not exist.</p>
            <Button variant="primary" onClick={handleGoHome}>Go to Homepage</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;

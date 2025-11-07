import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import { fetchUsers } from '../../api'; // Assuming fetchUsers can get all staff data

const StaffProfileListPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStaff = async () => {
      try {
        const users = await fetchUsers(); // Fetch all users, assuming they are all staff for now
        setStaff(users);
      } catch (err) {
        setError('Failed to fetch staff profiles.');
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };
    getStaff();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading staff...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} className="me-2" />
          Back
        </Button>
        <h2 className="mb-0">Staff Profiles</h2>
        <div style={{ width: '100px' }}></div> {/* Spacer */}
      </div>

      {staff.length === 0 ? (
        <Alert variant="info" className="text-center">No staff profiles found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {staff.map((member) => (
            <Col key={member.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{member.username}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                  <Card.Text>
                    Email: {member.email}
                    {/* Add more summary details here if available */}
                  </Card.Text>
                  {/* Placeholder for ID copies - assuming member object has idFront and idBack URLs */}
                  {member.idFront && (
                    <div className="mb-2">
                      <h6>ID Front:</h6>
                      <img src={member.idFront} alt="ID Front" className="img-fluid rounded" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                  )}
                  {member.idBack && (
                    <div className="mb-2">
                      <h6>ID Back:</h6>
                      <img src={member.idBack} alt="ID Back" className="img-fluid rounded" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/admin/staff/profile/${member.id}`}
                    >
                      <Eye size={16} className="me-1" /> View Profile
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      as={Link}
                      to={`/admin/staff/profile/${member.id}`} // Link to the same page for editing
                    >
                      <Edit size={16} className="me-1" /> Edit Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StaffProfileListPage;

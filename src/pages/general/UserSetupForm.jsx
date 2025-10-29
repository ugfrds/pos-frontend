import { useState } from 'react';
import { Card, Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { updateUser } from '../../api';

const UserSetupForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await updateUser(formData.email, formData.username, formData.password);
      setShowSuccess(true);
    } catch (error) {
      setError(`Failed to update user: ${error}`);
    }
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
    });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');  // Redirect to the login page
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <div className="user-setup-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-dark">
      <Row className="w-100" style={{ maxWidth: '1000px' }}>
        <Col md={6}>
          <header className="text-center mb-4">
            <h1 className="display-4 mb-2" >Welcome to <span style={{ color: '#ff6f61' }} >WisePOS</span></h1>
            <p className="lead">Streamline your business operations with our state-of-the-art POS system.</p>
            <p className="lead">
              Did you know? Businesses using POS systems see up to a 20% increase in efficiency 
               and a 15% reduction in errors.
            </p>
          </header>
        </Col>
        <Col md={6}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Update Your Profile</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="Enter your registered Email"
                    autoComplete="off"
                    required 
                  />
                </Form.Group>

                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    placeholder="Create your username"
                    autoComplete="off"
                    required 
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3 position-relative">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="Create your password"
                    required 
                  />
                  <Button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                    onClick={togglePasswordVisibility}
                    style={{ border: 'none', background: 'transparent', color: '#6c757d' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3 position-relative">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    placeholder="Confirm your password"
                    required 
                  />
                  <Button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ border: 'none', background: 'transparent', color: '#6c757d' }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <footer className="text-center mt-4">
        <p>© 2024 WiseCorp Technologies. All rights reserved.</p>
      </footer>

      <Modal show={showSuccess} onHide={handleSuccessClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Your profile has been updated successfully!</p>
          <p>You will now be redirected to the login page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserSetupForm;

// SelfRegister.jsx - Updated with real API integration
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle, Shield, Zap, Users} from 'lucide-react';
import { toast } from 'sonner';
import { selfRegister } from '../../services/api';
import './SelfRegister.css';

const SelfRegister = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    adminEmail: '',
    adminPassword: '',
    confirmAdminPassword: '',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showConfirmAdminPassword, setShowConfirmAdminPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationResult, setRegistrationResult] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const validate = () => {
    const errs = {};
    if (!formData.businessName || !formData.businessName.trim()) errs.businessName = 'Business name is required';
    if (!formData.adminEmail || !/\S+@\S+\.\S+/.test(formData.adminEmail)) errs.adminEmail = 'Valid email is required';
    if (!formData.adminPassword || formData.adminPassword.length < 6) errs.adminPassword = 'Password must be at least 6 characters';
    if (formData.adminPassword !== formData.confirmAdminPassword) errs.confirmAdminPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    // simple validation
    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const registrationData = {
        businessName: formData.businessName,
        email: formData.adminEmail,
        password: formData.adminPassword,
      };

      const result = await selfRegister(registrationData);
      
      setRegistrationResult(result);
      setShowSuccess(true);
      
      toast.success(result.message || 'Business registered successfully! Please check your email for verification.');

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.missingFields) {
        toast.error(`Missing fields: ${error.missingFields.join(', ')}`);
      } else if (error.details) {
        toast.error(error.details);
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }

      // Set field-specific errors if provided by API
      if (error.details && Array.isArray(error.details)) {
        const fieldErrors = {};
        error.details.forEach(detail => {
          if (detail.field) {
            fieldErrors[detail.field] = detail.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  const renderForm = () => (
    <>
      <div className="form-header">
        <div className="form-logo">
          <Building className="form-logo-svg" />
        </div>
        <h2>Register Your Business</h2>
        <p>Quick signup — full setup happens inside the app.</p>
      </div>

      <form onSubmit={handleSubmit} className="self-register-form">
        <div className="input-group">
          <label htmlFor="businessName" className="input-label">
            <Building className="input-icon" />
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            className={`form-input ${errors.businessName ? 'error' : ''}`}
            placeholder="e.g., My Awesome Restaurant"
            value={formData.businessName}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.businessName && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.businessName}
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="adminEmail" className="input-label">
            <Mail className="input-icon" />
            Email *
          </label>
          <input
            id="adminEmail"
            type="email"
            name="adminEmail"
            className={`form-input ${errors.adminEmail ? 'error' : ''}`}
            placeholder="owner@mybusiness.com"
            value={formData.adminEmail}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.adminEmail && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.adminEmail}
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="adminPassword" className="input-label">
            <Lock className="input-icon" />
            Password *
          </label>
          <div className="password-input-wrapper">
            <input
              id="adminPassword"
              type={showAdminPassword ? 'text' : 'password'}
              name="adminPassword"
              className={`form-input ${errors.adminPassword ? 'error' : ''}`}
              placeholder="Create a strong password"
              value={formData.adminPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowAdminPassword(!showAdminPassword)}
              disabled={isLoading}
            >
              {showAdminPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          </div>
          {errors.adminPassword && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.adminPassword}
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="confirmAdminPassword" className="input-label">Confirm Password *</label>
          <div className="password-input-wrapper">
            <input
              id="confirmAdminPassword"
              type={showConfirmAdminPassword ? 'text' : 'password'}
              name="confirmAdminPassword"
              className={`form-input ${errors.confirmAdminPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmAdminPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmAdminPassword(!showConfirmAdminPassword)}
              disabled={isLoading}
            >
              {showConfirmAdminPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          </div>
          {errors.confirmAdminPassword && (
            <div className="error-message">
              <AlertCircle size={14} />
              {errors.confirmAdminPassword}
            </div>
          )}
        </div>

        <button type="submit" className={`setup-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="button-icon spinning" />
              Registering...
            </>
          ) : (
            <>
              Register
              <CheckCircle className="button-icon" />
            </>
          )}
        </button>
      </form>
    </>
  );

  return (
    <div className="self-register-page">
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="self-register-container">
        {/* Left Side - Brand & Info */}
        <div className="self-register-hero">
          <div className="hero-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <Building className="logo-svg" />
              </div>
              <h1 className="brand-name">WisePOS</h1>
            </div>

            <div className="hero-text">
              <h2>Register Your Business</h2>
              <p>Get your business set up with WisePOS and streamline your operations</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Secure & Reliable</h4>
                  <p>Your business data is protected with top-tier security measures</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Zap className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Quick Setup</h4>
                  <p>Register and start managing your sales in minutes</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Users className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Team Management</h4>
                  <p>Easily add and manage your staff accounts</p>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">{'10K+'}</div>
                <div className="stat-label">Businesses Trust Us</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="self-register-form-section">
          <div className="form-container">
            {renderForm()}

            <div className="self-register-footer">
              <p className="footer-text">
                Already have an account?{' '}
                <Link to="/" className="login-link">
                  Sign in here
                </Link>
              </p>
              <p className="footer-text">
                &copy; {new Date().getFullYear()} Wisecorp Technologies Ltd. All rights reserved.
              </p>
              <p className="developer-credit">
                Developed by:{' '}
                <a
                  href="https://ugfrds.github.io/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="developer-link"
                >
                  Justlikewiseman
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="modal-content">
              <CheckCircle className="success-icon" />
              <h3>Registration Complete!</h3>
              <p>{registrationResult?.message || 'Your business has been registered successfully.'}</p>
              {registrationResult?.data?.verification?.emailSent && (
                <div className="verification-notice">
                  <p>Please check your email to verify your account and complete the setup process.</p>
                </div>
              )}
              <button onClick={handleSuccessClose} className="modal-button">
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfRegister;
// SelfRegister.jsx - Updated with real API integration
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Loader2,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  User,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { selfRegister, validateBusinessData } from '../../services/api';
import './SelfRegister.css';

const SelfRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessWebsite: '',
    businessType: '',
    adminName: '',
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

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.businessName.trim()) {
      stepErrors.businessName = 'Business name is required';
    }
    
    if (!formData.businessEmail.trim()) {
      stepErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      stepErrors.businessEmail = 'Please enter a valid email address';
    }
    
    if (!formData.businessPhone.trim()) {
      stepErrors.businessPhone = 'Business phone is required';
    }
    
    if (!formData.businessAddress.trim()) {
      stepErrors.businessAddress = 'Business address is required';
    }
    
    if (!formData.businessType) {
      stepErrors.businessType = 'Please select a business type';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        toast.error('Please fix the errors before proceeding');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate step 2
    const validationErrors = validateBusinessData(formData);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for API
      const registrationData = {
        businessName: formData.businessName,
        ownerName: formData.adminName,
        email: formData.adminEmail,
        phone: formData.businessPhone,
        password: formData.adminPassword,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        businessWebsite: formData.businessWebsite,
        contactEmail: formData.businessEmail,
        contactPhone: formData.businessPhone
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-header">
              <div className="form-logo">
                <Building className="form-logo-svg" />
              </div>
              <h2>Business Details</h2>
              <p>Tell us about your business to get started</p>
            </div>

            <div className="self-register-form">
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
                <label htmlFor="businessEmail" className="input-label">
                  <Mail className="input-icon" />
                  Business Email *
                </label>
                <input
                  id="businessEmail"
                  type="email"
                  name="businessEmail"
                  className={`form-input ${errors.businessEmail ? 'error' : ''}`}
                  placeholder="contact@mybusiness.com"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                {errors.businessEmail && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.businessEmail}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="businessPhone" className="input-label">
                  <Phone className="input-icon" />
                  Business Phone *
                </label>
                <input
                  id="businessPhone"
                  type="tel"
                  name="businessPhone"
                  className={`form-input ${errors.businessPhone ? 'error' : ''}`}
                  placeholder="+1 234 567 8900"
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                {errors.businessPhone && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.businessPhone}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="businessAddress" className="input-label">
                  <MapPin className="input-icon" />
                  Business Address *
                </label>
                <input
                  id="businessAddress"
                  type="text"
                  name="businessAddress"
                  className={`form-input ${errors.businessAddress ? 'error' : ''}`}
                  placeholder="123 Business St, City, Country"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                {errors.businessAddress && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.businessAddress}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="businessWebsite" className="input-label">
                  <Globe className="input-icon" />
                  Business Website (Optional)
                </label>
                <input
                  id="businessWebsite"
                  type="url"
                  name="businessWebsite"
                  className="form-input"
                  placeholder="https://www.mybusiness.com"
                  value={formData.businessWebsite}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="businessType" className="input-label">
                  <Briefcase className="input-icon" />
                  Business Type *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  className={`form-input ${errors.businessType ? 'error' : ''}`}
                  value={formData.businessType}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select a business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="cafe">Cafe</option>
                  <option value="bar">Bar</option>
                  <option value="hotel">Hotel</option>
                  <option value="other">Other</option>
                </select>
                {errors.businessType && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.businessType}
                  </div>
                )}
              </div>

              <button type="button" onClick={nextStep} className="next-step-button" disabled={isLoading}>
                Next: Admin Details
                <ArrowLeft className="button-icon rotate-180" />
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-header">
              <div className="form-logo">
                <User className="form-logo-svg" />
              </div>
              <h2>Admin Account Setup</h2>
              <p>Create your administrator account for this business</p>
            </div>

            <form onSubmit={handleSubmit} className="self-register-form">
              <div className="input-group">
                <label htmlFor="adminName" className="input-label">
                  <User className="input-icon" />
                  Admin Name *
                </label>
                <input
                  id="adminName"
                  type="text"
                  name="adminName"
                  className={`form-input ${errors.adminName ? 'error' : ''}`}
                  placeholder="Your Full Name"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                {errors.adminName && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.adminName}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="adminEmail" className="input-label">
                  <Mail className="input-icon" />
                  Admin Email *
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  name="adminEmail"
                  className={`form-input ${errors.adminEmail ? 'error' : ''}`}
                  placeholder="admin@mybusiness.com"
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
                <p className="input-help">
                  This will be the primary email for your admin account
                </p>
              </div>

              <div className="input-group">
                <label htmlFor="adminPassword" className="input-label">
                  <Lock className="input-icon" />
                  Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="adminPassword"
                    type={showAdminPassword ? "text" : "password"}
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
                <p className="input-help">
                  Minimum 6 characters with letters and numbers
                </p>
              </div>

              <div className="input-group">
                <label htmlFor="confirmAdminPassword" className="input-label">
                  Confirm Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmAdminPassword"
                    type={showConfirmAdminPassword ? "text" : "password"}
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

              <button
                type="submit"
                className={`setup-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Registering Business...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <CheckCircle className="button-icon" />
                  </>
                )}
              </button>

              <button type="button" onClick={prevStep} className="back-link" disabled={isLoading}>
                <ArrowLeft className="back-icon" />
                Back to Business Details
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

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
            {renderStepContent()}

            <div className="self-register-footer">
              <p className="footer-text">
                Already have an account?{' '}
                <Link to="/login" className="login-link">
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
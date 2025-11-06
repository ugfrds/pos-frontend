import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { updateUser } from '../../api';
import './NewUser.css';

const NewUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await updateUser(formData.email, formData.username, formData.password);
      setShowSuccess(true);
      toast.success('Profile updated successfully! You can now log in.');
    } catch (error) {
      toast.error('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="new-user-page">
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="new-user-container">
        {/* Left Side - Brand & Info */}
        <div className="new-user-hero">
          <div className="hero-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <Users className="logo-svg" />
              </div>
              <h1 className="brand-name">WisePOS</h1>
            </div>
            
            <div className="hero-text">
              <h2>Complete Your Profile</h2>
              <p>Set up your account credentials to access your workspace and collaborate with your team</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Bank-Level Security</h4>
                  <p>Your data is encrypted and protected with enterprise-grade security</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Instant Access</h4>
                  <p>Start working immediately after completing your setup</p>
                </div >
              </div >
            </div >

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">20%</div>
                <div className="stat-label">Efficiency Boost</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15%</div>
                <div className="stat-label">Error Reduction</div>
              </div>
            </div>
          </div >
        </div >

        {/* Right Side - Setup Form */}
        <div className="new-user-form-section">
          <div className="form-container">
            <div className="form-header">
              <div className="form-logo">
                <User className="form-logo-svg" />
              </div>
              <h2>User Account Setup</h2>
              <p>Complete your profile to unlock personalized features</p>
            </div>

            <form onSubmit={handleSubmit} className="new-user-form">
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <Mail className="input-icon" />
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  <User className="input-icon" />
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Create your unique username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                <p className="input-help">
                  This will be your display name across the platform
                </p>
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <Lock className="input-icon" />
                  Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>
                <p className="input-help">
                  Minimum 6 characters with letters and numbers
                </p>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`setup-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Setting Up Account...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="button-icon" />
                  </>
                )}
              </button>

              <Link to="/" className="back-link">
                <ArrowLeft className="back-icon" />
                Back to Login
              </Link>
            </form>

            <div className="new-user-footer">
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
              <h3>Setup Complete!</h3>
              <p>Your profile has been updated successfully.</p>
              <p>You will now be redirected to the login page.</p>
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

export default NewUser;

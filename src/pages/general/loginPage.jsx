import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShoppingCart, 
  TrendingUp, 
  Shield,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { login } from '../../api';
import './login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await login(username, password);
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('role', response.role);
      sessionStorage.setItem('username', response.username);
      
      if (response.role === 'superadmin') {
        window.location.replace('/superadmin/dashboard');
      } else if (response.role === 'BusinessAdmin') {
        window.location.replace('/admin/dashboard');
      } else {
        window.location.replace('/dashboard');
      }
      
      setPassword('');
    } catch (error) {
      setError(`Invalid username or password. Please try again. ${error}`);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-container">
        {/* Left Side - Brand & Features */}
        <div className="login-hero">
          <div className="hero-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <ShoppingCart className="logo-svg" />
              </div>
              <h1 className="brand-name">WisePOS</h1>
            </div>
            
            <div className="hero-text">
              <h2>Your Gateway to Smarter Business Management</h2>
              <p>Join thousands of businesses transforming their operations with our intelligent point-of-sale system</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Real-time Analytics</h4>
                  <p>Make data-driven decisions instantly</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield className="feature-svg" />
                </div>
                <div className="feature-text">
                  <h4>Enterprise Security</h4>
                  <p>Bank-level protection for your data</p>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Businesses</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">$2.5M+</div>
                <div className="stat-label">Monthly Sales</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  <User className="input-icon" />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <Lock className="input-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
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
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </button>

              <div className="form-links">
                <Link to="/forgot-password" className="form-link">
                  Forgot Password?
                </Link>
                <div className="links-divider">|</div>
                <Link to="/self-register" className="form-link highlight">
                  Register Business
                </Link>
                <div className="links-divider">|</div>
                <Link to="/newuser" className="form-link highlight">
                  Create User Account
                </Link>
              </div>
            </form>

            <div className="login-footer">
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
    </div>
  );
};

export default LoginPage;
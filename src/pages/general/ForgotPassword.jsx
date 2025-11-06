import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ShoppingCart, Send, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="forgot-password-container">
        {/* Left Side - Brand & Info */}
        <div className="forgot-password-hero">
          <div className="hero-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <ShoppingCart className="logo-svg" />
              </div>
              <h1 className="brand-name">WisePOS</h1>
            </div>
            
            <div className="hero-text">
              <h2>Reset Your Password</h2>
              <p>We'll send you a secure link to reset your password and get you back to business</p>
            </div>

            <div className="security-features">
              <div className="security-card">
                <div className="security-icon">
                  <Shield className="security-svg" />
                </div>
                <div className="security-text">
                  <h4>Secure Process</h4>
                  <p>Encrypted reset links that expire in 1 hour</p>
                </div>
              </div>
              
              <div className="security-card">
                <div className="security-icon">
                  <Send className="security-svg" />
                </div>
                <div className="security-text">
                  <h4>Instant Delivery</h4>
                  <p>Reset links delivered to your email immediately</p>
                </div>
              </div>
            </div>

            <div className="recovery-stats">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{'<'} 2min</div>
                <div className="stat-label">Average Recovery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="forgot-password-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Forgot Password?</h2>
              <p>Enter your email and we'll send you reset instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <Mail className="input-icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="input-help">
                  Make sure to use the email associated with your WisePOS account
                </p>
              </div>

              <button
                type="submit"
                className={`reset-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Send className="button-icon" />
                    Send Reset Instructions
                  </>
                )}
              </button>

              <Link to="/login" className="back-link">
                <ArrowLeft className="back-icon" />
                Back to Login
              </Link>
            </form>

            <div className="forgot-password-footer">
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

export default ForgotPassword;
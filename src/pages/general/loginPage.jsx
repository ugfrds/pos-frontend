import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-dark">
      <div className="login-card shadow p-4 rounded position-relative">
        <header className="text-center mb-4">
          <h1 className="display-4 mb-2">Welcome to <span style={{ color: '#ff6f61' }} >WisePOS</span></h1>
          <p className="lead">Your gateway to a smarter point-of-sale experience.</p>
        </header>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              onClick={togglePasswordVisibility}
              style={{ border: 'none', background: 'transparent', color: '#6c757d' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-custom w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
          <div className="d-flex justify-content-between mt-3">
            <Link to="/forgot-password" className="btn btn-link">Forgot Password?</Link>
            <Link to="/newuser" className="btn btn-link">New User? Sign Up</Link>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
        <div className="text-center mt-4">
          <p className="mb-2">&copy; {new Date().getFullYear()} Wisecorp Technologies Ltd. All rights reserved.</p>
          <small>Developed By: <a 
          style={{  color: '#6c757d' }}
           href="https://ugfrds.github.io/portfolio" target="_blank">Justlikewiseman</a></small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

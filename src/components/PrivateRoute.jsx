
import { Navigate, useLocation } from 'react-router-dom';
//import jwtDecode from 'jwt-decode';

const isTokenValid = (token) => {
  try {
    //const decoded = jwtDecode(token);
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 > Date.now(); // Check token expiration
  } catch (error) {
    return false; // Invalid token
  }
};

const hasAccess = (userRole, roles) => {
  return roles.includes(userRole);
};

const PrivateRoute = ({ children, roles = [], ...rest }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');
  const location = useLocation();

  // If no token or invalid token, redirect to login
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // If roles are defined and user role is not included, redirect to unauthorized
  if (roles.length > 0 && !hasAccess(userRole, roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  // Authorized, render the children
  return children;
};

export default PrivateRoute;

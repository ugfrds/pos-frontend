import { Navigate, useLocation } from 'react-router-dom';

/**
 * A route component that restricts access based on authentication and user roles.
 * Redirects users to the login page if they are unauthenticated or to an unauthorized page if they lack proper permissions.
 * 
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The components to render if access is granted.
 * @param {string[]} [props.roles=[]] - An array of roles permitted to access the route.
 * @returns {React.ReactNode} - Renders children if authorized, otherwise redirects.
 */
/**
 * @isValidToken
 * Validates a JWT token by decoding its payload and checking expiration.
 * @param {string} token - The JWT token to validate.
 * @returns {boolean} - Returns `true` if the token is valid and not expired, otherwise `false`.
 */
/**
 * @hasAccess
 * Determines if the user's role matches one of the allowed roles.
 * @param {string} userRole - The role of the current user.
 * @param {string[]} roles - Array of roles allowed to access the route.
 * @returns {boolean} - Returns `true` if the user's role is in the allowed roles, otherwise `false`.
 */


const isTokenValid = (token) => {
  try {
    // Decode the JWT payload and check expiration
    const Decoded = JSON.parse(atob(token.split('.')[1]));
    return Decoded.exp * 1000 > Date.now(); // Ensure the token is not expired
  } catch (error) {
    return false; // Return false for invalid tokens
  }
};

const hasAccess = (userRole, roles) => {
  return roles.includes(userRole);
};

const PrivateRoute = ({ children, roles = [] }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');
  const location = useLocation();

  // Redirect to login if token is missing or invalid
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Redirect to unauthorized page if user role is not allowed
  if (roles.length > 0 && !hasAccess(userRole, roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  // Render the children if the user is authorized
  return children;
};

export default PrivateRoute;

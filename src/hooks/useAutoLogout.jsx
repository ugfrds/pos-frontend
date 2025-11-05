
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    sessionStorage.clear(); //clear entire session storage
    navigate('/'); // Redirect to login page
  }, [navigate]); // Memoize with 'navigate' as a dependency

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired
        handleLogout();
      } else {
        // Set a timeout to log out the user when the token expires
        const timeout = (decodedToken.exp - currentTime) * 1000;
        
        
        const logoutTimer = setTimeout(() => {
          handleLogout();
        }, timeout);

        // Clear the timeout if the component unmounts or the token changes
        return () => clearTimeout(logoutTimer);
      }
    }
  }, [handleLogout]); // 'handleLogout' is now stable and a valid dependency
};

export default useAutoLogout;

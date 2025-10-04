
const logout = () => {
  // Clear the session storage or local storage
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = '/';
};

export default logout;
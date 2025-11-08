// services/api.js - Updated with onboarding endpoints
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pos-backend-m3rs.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for registration
});

// Enhanced error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const errorData = {
      status,
      message: data.error || 'An error occurred',
      details: data.details || data.message,
      missingFields: data.missingFields,
      referenceId: data.referenceId
    };
    console.error('API Error:', errorData);
    throw errorData;
  } else if (error.request) {
    // Network error
    const networkError = {
      status: 0,
      message: 'Network error',
      details: 'Unable to connect to server. Please check your internet connection.'
    };
    console.error('Network Error:', networkError);
    throw networkError;
  } else {
    // Other errors
    throw {
      status: 500,
      message: 'Unexpected error',
      details: error.message
    };
  }
};

// Onboarding API calls
const selfRegister = async (registrationData) => {
  try {
    const response = await api.post('/onboarding/register', registrationData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const verifyEmail = async (email, otp) => {
  try {
    const response = await api.post('/onboarding/verify-email', { email, otp });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const resendVerification = async (email) => {
  try {
    const response = await api.post('/onboarding/resend-verification', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Validation helpers
const validateBusinessData = (data) => {
  const errors = [];
  
  if (!data.businessName?.trim()) {
    errors.push('Business name is required');
  }
  
  if (!data.businessEmail?.trim()) {
    errors.push('Business email is required');
  } else if (!/\S+@\S+\.\S+/.test(data.businessEmail)) {
    errors.push('Business email is invalid');
  }
  
  if (!data.businessPhone?.trim()) {
    errors.push('Business phone is required');
  }
  
  if (!data.adminEmail?.trim()) {
    errors.push('Admin email is required');
  } else if (!/\S+@\S+\.\S+/.test(data.adminEmail)) {
    errors.push('Admin email is invalid');
  }
  
  if (!data.adminPassword) {
    errors.push('Password is required');
  } else if (data.adminPassword.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(data.adminPassword)) {
    errors.push('Password must contain at least one letter and one number');
  }
  
  if (data.adminPassword !== data.confirmAdminPassword) {
    errors.push('Passwords do not match');
  }
  
  return errors;
};

export {
  selfRegister,
  verifyEmail,
  resendVerification,
  validateBusinessData
};

// Export existing APIs as well
export * from '../api';
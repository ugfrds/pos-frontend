import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pos-backend-m3rs.onrender.com/api', // Your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to get the token from sessionStorage
const getAuthToken = () => sessionStorage.getItem('token');

// Helper function to set the authorization headers
const setAuthHeader = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

// Robust error handling function
const handleApiError = (error) => {
    console.error('API call failed:', error.response?.data || error.message);
    throw error.response?.data || error;
};



// Login
const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Create a new user
const createUser = async (email, role) => {
    try {
        const response = await api.post('/user', { email, role }, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Register a new user
const updateUser = async (email , username, password) => {
  try {
      const response = await api.put('/register', { username, password, email });
      return response.data;
  } catch (error) {
      handleApiError(error);
  }
};

// Update user info
const updateUserInfo = async (id, updatedInfo) => {
    try {
        const response = await api.put(`/user/${id}`, updatedInfo, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Delete a user
const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/user/${id}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Lock a user
const lockUser = async (id) => {
    try {
        const response = await api.patch(`/user/${id}/lock`, null, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Unlock a user
const unlockUser = async (id) => {
    try {
        const response = await api.patch(`/user/${id}/unlock`, null, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Fetch all users
const fetchUsers = async () => {
    try {
        const response = await api.get('/users', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Get user by ID
const getUserById = async (id) => {
    try {
        const response = await api.get(`/businessadmin/user/${id}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

/**
 * =======================
 * Business Management APIs
 * =======================
 */

// Create a new business
const createBusiness = async (email, businessName) => {
    try {
        const response = await api.post('/create', { email, businessName }, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Update business info
const updateBusinessInfo = async (id, updatedInfo) => {
    try {
        const response = await api.put(`/business/${id}`, updatedInfo, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Delete a business
const deleteBusiness = async (id) => {
    try {
        const response = await api.delete(`/business/${id}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Fetch all businesses
const getAllBusinesses = async () => {
    try {
        const response = await api.get('/businesses', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Get business by ID
const getBusinessById = async (id) => {
    try {
        const response = await api.get(`/business/${id}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getBusinessDetails = async () => {
    try {
        const response = await api.get('/', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

/**
 * =======================
 * Menu Items Management APIs
 * =======================
 */

// Create a new menu item
const createMenuItem = async (menuItem) => {
    try {
        const response = await api.post('/menu-items', menuItem, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Update a menu item
const updateMenuItem = async (id, menuItem) => {
    try {
        const response = await api.put(`/menu-items/${id}`, menuItem, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Fetch all menu items
const fetchMenuItems = async () => {
    try {
        const response = await api.get('/menu-items', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Delete a menu item
const deleteMenuItem = async (id) => {
    try {
        await api.delete(`/menu-items/${id}`, setAuthHeader());
    } catch (error) {
        handleApiError(error);
    }
};

/**
 * =======================
 * Order Management APIs
 * =======================
 */

//save order 
const createOrder = async( Order) => {
    try{ 
        const response = await api.post('/save-order',Order, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// Fetch all orders with optional filters and pagination
const getAllOrders = async (filters, page = 1, limit = 15) => {
  try {  
    const { status, startDate, endDate, tableNumber, item } = filters; // Include 'item' in destructuring
    const response = await api.get('/orders', {
      params: { status, startDate, endDate, tableNumber, item, page, limit }, // Add 'item' to params
      ...setAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    handleApiError(error);
    throw error; // Ensure the error propagates to the caller
  }
};

const getActiveOrders = async( ) => {
    try{ 
        const response = await api.get('/active-orders', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// Search orders by item name
const searchOrdersByItem = async (searchTerm) => {
    try {
        const response = await api.get('/search', {
            params: { item: searchTerm },
            ...setAuthHeader(),
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Retrieve a specific order by ID
const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}; 

// edit/ Update order
const updateOrder = async (orderId, orderData) => {
    try {
        const response = await api.put(`/update-order`, {orderId, orderData }, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
 
// Update the status of an order
const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/close-order`, {orderId,status }, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateOrderPrintStatus = async (orderId, isPrinted) => {
    try {
        console.log(isPrinted);
      const response = await api.patch(`/print-order`, {orderId, isPrinted }, setAuthHeader());
      return response.data;
    }  catch (error) {
        handleApiError(error); 
    }
};

const deleteOrder = async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`, setAuthHeader() );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
    
    

/**
 * =======================
 * Superadmin APIs
 * =======================
 */

// Create a new admin
const createAdmin = async (email, role) => {
    try {
        const response = await api.post('/createAdmin', { email, role }, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Fetch all admins
const getAllAdmins = async () => {
    try {
        const response = await api.get('/admins', setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Delete an admin
const deleteAdmin = async (id) => {
    try {
        const response = await api.delete(`/admin/${id}`, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Update admin info
const updateAdmin = async (id, updated) => {
    try {
        const response = await api.put(`/admin/${id}`, updated, setAuthHeader());
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

//settings
// Fetch the current settings for the logged-in business
 const getSettings = async () => {
    try {
        const response = await api.get('/', setAuthHeader() );
        return response.data.settings;
        
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
};

// Save the settings for the logged-in business
 const saveSettings = async (settings) => {
    try {
        const response = await api.put('/',settings, setAuthHeader());
        console.log (response.config.data);
        return response.status === 200;
        
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
};


export const getDashboardData = async (period, startDate = null, endDate = null) => {
    try {
        const params = new URLSearchParams();
        params.append('period', period);

        // Include startDate and endDate if the period is 'custom'
        if (period === 'custom' && startDate && endDate) {
            params.append('startDate', startDate);
            params.append('endDate', endDate);
        }

        const response = await api.get(`/dashboard?${params.toString()}`, setAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

export const getSalesOverTime = async (period) => {
    try {
        const response = await api.get(`/sales-over-time?period=${period}`, setAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw error;
    }
};




const startShift = async( username)=> {
    try {
        const response = await api.post('/start/shift', {username} ,setAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error; 
    }
} ;



 
const endShift = async( shiftId, username)=> {
    try {
        const response = await api.put('/end/shift', {shiftId,username} ,setAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error; 
    }
} ;

const getShift = async( )=> {
    try {
        const response = await api.get('/shift',setAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error; 
    }
} ;




// Export all API calls at the end
export {
    //settings
    getSettings,
    saveSettings,
    //user
    login,
    createUser,
    updateUser,
    updateUserInfo,
    deleteUser,
    lockUser,
    unlockUser,
    fetchUsers,
    getUserById,
    //business
    createBusiness,
    updateBusinessInfo,
    deleteBusiness,
    getAllBusinesses,
    getBusinessById,
    getBusinessDetails,
    //menu 
    createMenuItem,
    updateMenuItem,
    fetchMenuItems,
    deleteMenuItem,
    //orders
    createOrder,
    getAllOrders,
    getActiveOrders,
    searchOrdersByItem,
    updateOrder,
    getOrderById,
    updateOrderStatus,
    updateOrderPrintStatus,
    deleteOrder,
    //superadmin
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,

    //shifts
    getShift,
    startShift,
    endShift
};

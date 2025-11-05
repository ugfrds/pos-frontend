import  { createContext, useState, useEffect } from 'react';
import { getBusinessDetails } from '../api';
import { getCachedData } from '../utils/Cache'; // Import the utility function

// Create the context
export const UserBusinessContext = createContext();

// Create a provider component
export const UserBusinessProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        role: null,
        username: null,
        businessId: null,
    });

    const [business, setBusiness] = useState({
        name: '',
        settings: {
            currency: '',
            taxPercentage: 0,
            serviceCharge: 0,
            receiptNotes: '',
        },
    });

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage

        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token

                // Set user data from decoded token
                setUser({
                    id: decodedToken.id,
                    role: decodedToken.role,
                    username: decodedToken.username,
                    businessId: decodedToken.businessId,
                });

                // Fetch or retrieve cached business details
                getCachedData('businessDetails', getBusinessDetails)
                    .then((data) => {
                        setBusiness({
                            name: data.name,
                            settings: data.settings,
                        });
                        setIsAuthenticated(true); // User is authenticated
                    })
                    .catch((error) => {
                        console.error('Error fetching business details:', error);
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading
                    });
            } catch (error) {
                console.error('Error decoding token:', error);
                setLoading(false); // Stop loading even if token decoding fails
            }
        } else {
            setLoading(false); // No token, stop loading
        }
    }, []);

    if (loading) return <div>Loading...</div>; // Show a loading indicator

    return (
        <UserBusinessContext.Provider value={{ user, business, setBusiness, isAuthenticated }}>
            {children}
        </UserBusinessContext.Provider>
    );
};

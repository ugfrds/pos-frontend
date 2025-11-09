
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { OrderProvider } from './context/OrderContext';
import { UserBusinessProvider } from './context/UserBusinessContext';


import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import { BusinessSetupProvider } from './context/BusinessSetupContext.jsx';

// Get the root element from the DOM
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <UserBusinessProvider>
    <BusinessSetupProvider>
    <OrderProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </OrderProvider>
    </BusinessSetupProvider>
  </UserBusinessProvider>
);

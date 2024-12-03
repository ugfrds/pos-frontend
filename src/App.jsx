import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import useAutoLogout from './hooks/useAutoLogout';


// Pages
import LoginPage from './pages/general/loginPage';

import AdminDashboard from './pages/superadmin/AdminDashboard';
import BusinessDashboard from './pages/businessadmin/BusinessDashboard';
import ManageBusinesses from './pages/superadmin/ManageBusinesses';
import AddBusiness from './pages/superadmin/AddBusiness';
import ManageUsers from './pages/superadmin/ManageUsers';
import AddUser from './pages/superadmin/AddUser';
import ErrorPage from './pages/general/ErrorPage';
import Settings from './pages/superadmin/Settings';
import Dashboard from './pages/general/Dashboard';
import TablesPage from './pages/general/TablesPage';
import OrderPage from './pages/general/OrderPage';
import MenuPage from './pages/general/MenuPage';
import UserSetupForm from './pages/general/UserSetupForm';
import UnauthorizedPage from './pages/general/UnauthorizedPage';

// Components

import PendingOrders from './pages/businessadmin/PendingOrders';
import OrderHistori from './pages/businessadmin/orderhistori';
import MenuManagementPage from './pages/businessadmin/MenuManagementPage';
import UserManagementPage from './pages/businessadmin/UserManagementPage';
import AddStaff from './pages/businessadmin/AddStaff';
import SettingPage from './components/Settings/SettingPage';
//import ExpensesPage from './components/expenses/ExpensesPage';
import ExpendituresPage from './pages/businessadmin/ExpendituresPage';


// Layouts
import SuperadminLayout from './layouts/SuperadminLayout';
import AdminLayout from './layouts/AdminLayout';

const App = () => {
 
  useAutoLogout();

  return (
    
     <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/newuser" element={<UserSetupForm />} />

      {/* Protected routes for superadmin */}
      <Route
        path="/superadmin/*"
        element={
          <PrivateRoute roles = {['superadmin']} >
            <SuperadminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-businesses" element={<ManageBusinesses />} />
        <Route path="add-business" element={<AddBusiness />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Protected routes for admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute  role={['BusinessAdmin']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<BusinessDashboard />} />
        <Route path="manage-menu" element={<MenuManagementPage />} />
        <Route path="staff" element={<UserManagementPage />} />
        <Route path="add-staff" element={<AddStaff />} />
        <Route path="settings" element={<SettingPage />} />
        <Route path="orderhistori" element={<OrderHistori /> }/>
      </Route>

      {/* Additional protected routes */}
      <Route
        path="/business-dashboard"
        element={
          <PrivateRoute>
            <BusinessDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <PrivateRoute>
            <TablesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <PrivateRoute>
            <MenuPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/order/:tableNumber"
        element={
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        }
      />
      
     
      {/* Public routes */}
      <Route path="/pending" element={<PendingOrders/>} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/expenses" element={<ExpendituresPage />} />
     </Routes>
    
  );
};

export default App;


import Debtors from './components/bodyComponents/debtors/Debtors';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import GlobalLoader from './components/GlobalLoader';
import PrivateRoute from './components/PrivateRoute';
import useAutoLogout from './hooks/useAutoLogout';
import FirstVisitBanner from "./components/firstvisitBanner";


// Pages
import LoginPage from './pages/general/loginPage';
import NewUser from './pages/general/NewUser';
import SelfRegister from './pages/general/SelfRegister';
import ForgotPassword from './pages/general/ForgotPassword';

import AdminDashboard from './pages/superadmin/AdminDashboard';
import BusinessDashboard from './pages/businessadmin/BusinessDashboard';
import ManageBusinesses from './pages/superadmin/ManageBusinesses';
import AddBusiness from './pages/superadmin/AddBusiness';
import ManageUsers from './pages/superadmin/ManageUsers';
import AddUser from './pages/superadmin/AddUser';
import ErrorPage from './pages/general/ErrorPage';
import NotFound from './pages/general/NotFound';
import Settings from './pages/superadmin/Settings';
import Dashboard from './pages/general/Dashboard';
import TablesPage from './pages/general/TablesPage';
import OrderPage from './pages/general/OrderPage';
import MenuPage from './pages/general/MenuPage';
import UnauthorizedPage from './pages/general/UnauthorizedPage';
import SuperAdminForm from './pages/superadmin/superadmin';
import SalesReport from './pages/businessadmin/SalesReport';

// Components

import ReportsPage from './pages/businessadmin/ReportsPage';

// Components

import PendingOrders from './pages/businessadmin/PendingOrders';
import OrderHistori from './pages/businessadmin/orderhistori';
import MenuManagementPage from './pages/businessadmin/MenuManagementPage';
import UserManagementPage from './pages/businessadmin/UserManagementPage';
import AddStaff from './pages/businessadmin/AddStaff';
import SettingPage from './components/Settings/SettingPage';
//import ExpensesPage from './components/expenses/ExpensesPage';
import ExpendituresPage from './pages/businessadmin/expendituresPage';
import AdminInventoryPage from './pages/businessadmin/AdminInventoryPage';


// Layouts
import SuperadminLayout from './layouts/SuperadminLayout';
import AdminLayout from './layouts/AdminLayout';

//
//import Expenses from './components/bodyComponents/expenses/Expenses'
import Inventory from './components/bodyComponents/inventory/Inventory';
import RootComponent from './components/RootComponent';


const App = () => {
 
  useAutoLogout();

  return (
    <LoadingProvider>
      <div>
        <FirstVisitBanner />
        <GlobalLoader />
        <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/self-register" element={<SelfRegister />} />
      <Route path="/newuser" element={<NewUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


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
  element={<AdminLayout />} 
>
  {/* BusinessAdmin-only routes */}
  <Route
    path="dashboard"
    element={
      <PrivateRoute roles={['BusinessAdmin']}>
        <BusinessDashboard />
      </PrivateRoute>
    }
  />
  <Route
    path="settings"
    element={
      <PrivateRoute roles={['BusinessAdmin']}>
        <SettingPage />
      </PrivateRoute>
    }
  />
  <Route
    path="orderhistory"
    element={
      <PrivateRoute roles={['BusinessAdmin','Supervisor', 'Cashier']}>
        <OrderHistori />
      </PrivateRoute>
    }
  />

  {/* Routes shared between BusinessAdmin and Supervisor */}
  <Route
    path="manage-menu"
    element={
      <PrivateRoute roles={['BusinessAdmin', 'Supervisor']}>
        <MenuManagementPage />
      </PrivateRoute>
    }
  />
  <Route
    path="staff"
    element={
      <PrivateRoute roles={['BusinessAdmin', 'Supervisor']}>
        <UserManagementPage />
      </PrivateRoute>
    }
  />
  <Route
    path="add-staff"
    element={
      <PrivateRoute roles={['BusinessAdmin', 'Supervisor']}>
        <AddStaff />
      </PrivateRoute>
    }
  />

   <Route
    path="sales-report"
    element={
      <PrivateRoute roles={['BusinessAdmin', 'Supervisor']}>
        <SalesReport />
      </PrivateRoute>
    }
  />
  <Route
    path="reports/*"
    element={
      <PrivateRoute roles={['BusinessAdmin', 'Supervisor']}>
        <ReportsPage />
      </PrivateRoute>
    }
  >
    <Route path="inventory" element={<AdminInventoryPage />} />
    <Route path="expenses" element={<ExpendituresPage />} />
    <Route path="debtors" element={<Debtors />} />
    <Route index element={<Navigate to="/admin/reports/inventory" />} />
  </Route>
</Route>


      {/* Additional protected routes */}
      
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
      <Route path='/su' element= {<SuperAdminForm />} />
      <Route path="/pending" element={<PendingOrders/>} />
  <Route path="*" element={<NotFound />} />
  <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route  element={<RootComponent />}>
        <Route path="/inventory" element={<Inventory />}></Route>
        {/* <Route index element={<Home />} />  */}
        {/* <Route path="/home" element={<Home />}></Route> */}
        
        {/* <Route path="/orders" element={<Order />}></Route>
        <Route path="/customers" element={<Customer />}></Route>
        <Route path="/expenses" element={<Expenses />}></Route>
        <Route path="/growth" element={<Growth />}></Route>
        <Route path="/reports" element={<Report />}></Route>
        <Route path="/settings" element={<Setting />}></Route> */}
       </Route> 
    
        </Routes>
      </div>
    </LoadingProvider>
  );
};

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Inventory from './pages/Inventory';
import StaffManagement from './pages/StaffManagement';
import Customers from './pages/Customers';
import Transactions from './pages/Transactions';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';
import Unauthorized from './pages/Unauthorized';

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.userType === 'CUSTOMER' ? '/customer-dashboard' : '/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/customer-dashboard" replace /> : <Register />}
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Customers />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.userType === 'CUSTOMER' ? '/customer-dashboard' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

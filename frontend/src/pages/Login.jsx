import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { HiOutlineCube } from 'react-icons/hi';

const Login = () => {
  const [loginType, setLoginType] = useState('staff');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = loginType === 'staff'
        ? await authAPI.staffLogin(formData)
        : await authAPI.customerLogin(formData);

      const { data } = response.data;
      login(data, data.token);
      toast.success('Login successful!');

      if (data.userType === 'CUSTOMER') {
        navigate('/customer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <HiOutlineCube className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Pro</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginType('staff')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              loginType === 'staff'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Staff / Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginType('customer')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              loginType === 'customer'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Customer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {loginType === 'customer' ? 'PIN' : 'Password'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder={loginType === 'customer' ? 'Enter your PIN' : 'Enter your password'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {loginType === 'customer' && (
          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            Demo: admin@inventory.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

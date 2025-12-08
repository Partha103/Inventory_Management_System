import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineUserGroup,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineLogout,
} from 'react-icons/hi';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin, isCustomer } = useAuth();

  const staffMenuItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/inventory', icon: HiOutlineCube, label: 'Inventory' },
    { path: '/transactions', icon: HiOutlineShoppingCart, label: 'Transactions' },
  ];

  const adminMenuItems = [
    ...staffMenuItems,
    { path: '/staff', icon: HiOutlineUsers, label: 'Staff Management' },
    { path: '/customers', icon: HiOutlineUserGroup, label: 'Customers' },
  ];

  const customerMenuItems = [
    { path: '/customer-dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/shop', icon: HiOutlineCube, label: 'Shop' },
    { path: '/my-orders', icon: HiOutlineShoppingCart, label: 'My Orders' },
  ];

  let menuItems = staffMenuItems;
  if (isAdmin()) {
    menuItems = adminMenuItems;
  } else if (isCustomer()) {
    menuItems = customerMenuItems;
  }

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-900 min-h-screen transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
          <h1 className="text-white text-xl font-bold">Inventory Pro</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
        >
          {collapsed ? <HiOutlineChevronRight size={20} /> : <HiOutlineChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={24} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="mb-3 text-sm text-gray-400">
            <p className="font-medium text-white">{user?.name}</p>
            <p>{user?.designation || 'Customer'}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <HiOutlineLogout size={24} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

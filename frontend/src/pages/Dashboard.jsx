import { useState, useEffect } from 'react';
import { dashboardAPI, inventoryAPI, transactionAPI } from '../services/api';
import StatCard from '../components/StatCard';
import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineExclamation,
  HiOutlineUserGroup,
} from 'react-icons/hi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes, lowStockRes] = await Promise.all([
        dashboardAPI.getStats(),
        transactionAPI.getAll(),
        inventoryAPI.getLowStock(10),
      ]);

      setStats(statsRes.data.data);
      setRecentTransactions(transactionsRes.data.data.slice(0, 5));
      setLowStockItems(lowStockRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your inventory system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Staff"
          value={stats?.totalStaff || 0}
          icon={HiOutlineUsers}
          color="blue"
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers || 0}
          icon={HiOutlineUserGroup}
          color="green"
        />
        <StatCard
          title="Inventory Items"
          value={stats?.totalInventoryItems || 0}
          icon={HiOutlineCube}
          color="purple"
        />
        <StatCard
          title="Transactions"
          value={stats?.totalTransactions || 0}
          icon={HiOutlineShoppingCart}
          color="yellow"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems || 0}
          icon={HiOutlineExclamation}
          color="red"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={HiOutlineCurrencyDollar}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="table-header">Customer</th>
                    <th className="table-header">Item</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="table-cell">{tx.customerName}</td>
                      <td className="table-cell">{tx.itemName}</td>
                      <td className="table-cell">{tx.quantity}</td>
                      <td className="table-cell font-medium">
                        ${tx.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Low Stock Alerts
          </h3>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">All items are well stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.itemName}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{item.quantity}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

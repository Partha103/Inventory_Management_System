import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI, inventoryAPI } from '../services/api';
import StatCard from '../components/StatCard';
import { HiOutlineShoppingCart, HiOutlineCube, HiOutlineCurrencyDollar } from 'react-icons/hi';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [myTransactions, setMyTransactions] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [transactionsRes, itemsRes] = await Promise.all([
        transactionAPI.getByCustomer(user.id),
        inventoryAPI.getAvailable(),
      ]);

      setMyTransactions(transactionsRes.data.data);
      setAvailableItems(itemsRes.data.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = myTransactions.reduce((sum, tx) => sum + (tx.totalPrice || 0), 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500">Your personal dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="My Orders"
          value={myTransactions.length}
          icon={HiOutlineShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toLocaleString()}`}
          icon={HiOutlineCurrencyDollar}
          color="green"
        />
        <StatCard
          title="Available Items"
          value={availableItems.length}
          icon={HiOutlineCube}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            My Recent Orders
          </h3>
          {myTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {myTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{tx.itemName}</p>
                    <p className="text-sm text-gray-500">Qty: {tx.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${tx.totalPrice?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Featured Items
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {availableItems.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 truncate">{item.itemName}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  ${item.price?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

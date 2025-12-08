import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await transactionAPI.getByCustomer(user.id);
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">View your purchase history</p>
        </div>
        <div className="card py-3 px-5">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-xl font-bold text-green-600">${totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.itemName}</h3>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-green-600">${order.totalPrice?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {order.createdDate
                        ? new Date(order.createdDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

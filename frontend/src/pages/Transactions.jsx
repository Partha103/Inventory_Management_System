import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { transactionAPI, customerAPI, inventoryAPI } from '../services/api';
import Modal from '../components/Modal';
import { HiOutlinePlus } from 'react-icons/hi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    itemId: '',
    quantity: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, customersRes, itemsRes] = await Promise.all([
        transactionAPI.getAll(),
        customerAPI.getAll(),
        inventoryAPI.getAvailable(),
      ]);

      setTransactions(transactionsRes.data.data);
      setCustomers(customersRes.data.data);
      setItems(itemsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionAPI.create({
        customerId: parseInt(formData.customerId),
        itemId: parseInt(formData.itemId),
        quantity: parseInt(formData.quantity),
      });

      toast.success('Transaction created successfully');
      setIsModalOpen(false);
      setFormData({ customerId: '', itemId: '', quantity: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    }
  };

  const selectedItem = items.find((i) => i.id === parseInt(formData.itemId));
  const estimatedTotal = selectedItem
    ? (selectedItem.price * parseInt(formData.quantity || 0)).toFixed(2)
    : '0.00';

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
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">View and create transactions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus size={20} />
          New Transaction
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Item</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Total</th>
                <th className="table-header">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">#{tx.id}</td>
                  <td className="table-cell">{tx.customerName}</td>
                  <td className="table-cell">{tx.itemName}</td>
                  <td className="table-cell">{tx.quantity}</td>
                  <td className="table-cell font-medium text-green-600">
                    ${tx.totalPrice?.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    {tx.createdDate
                      ? new Date(tx.createdDate).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <p className="text-center text-gray-500 py-8">No transactions found</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Transaction"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <select
              value={formData.itemId}
              onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName} - ${item.price} (Stock: {item.quantity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="input-field"
              min="1"
              max={selectedItem?.quantity || 1}
              required
            />
          </div>
          {selectedItem && formData.quantity && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Estimated Total</p>
              <p className="text-2xl font-bold text-gray-900">${estimatedTotal}</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Create Transaction
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;

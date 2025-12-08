import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { inventoryAPI, transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { HiOutlineShoppingCart, HiOutlineSearch } from 'react-icons/hi';

const Shop = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getAvailable();
      setItems(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }
    try {
      const response = await inventoryAPI.search(searchQuery);
      setItems(response.data.data.filter((item) => item.quantity > 0));
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handlePurchase = async () => {
    try {
      await transactionAPI.create({
        customerId: user.id,
        itemId: selectedItem.id,
        quantity: quantity,
      });

      toast.success('Purchase successful!');
      setIsModalOpen(false);
      setSelectedItem(null);
      setQuantity(1);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  const openPurchaseModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsModalOpen(true);
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
        <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
        <p className="text-gray-500">Browse and purchase items</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="input-field pl-10"
          />
        </div>
        <button onClick={handleSearch} className="btn-secondary">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-900 truncate">{item.itemName}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.category || 'Uncategorized'}</p>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
              {item.description || 'No description available'}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-blue-600">${item.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{item.quantity} in stock</p>
              </div>
              <button
                onClick={() => openPurchaseModal(item)}
                className="btn-primary py-2 px-3 flex items-center gap-1"
              >
                <HiOutlineShoppingCart size={18} />
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-gray-500 py-8">No items available</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Purchase"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">{selectedItem.itemName}</h4>
              <p className="text-sm text-gray-500">{selectedItem.category}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                ${selectedItem.price?.toLocaleString()} each
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, selectedItem.quantity))}
                className="input-field"
                min="1"
                max={selectedItem.quantity}
              />
              <p className="text-xs text-gray-500 mt-1">Max: {selectedItem.quantity}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-blue-600">
                ${(selectedItem.price * quantity).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={handlePurchase} className="btn-success flex-1">
                Confirm Purchase
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Shop;

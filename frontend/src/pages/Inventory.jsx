import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { inventoryAPI } from '../services/api';
import Modal from '../components/Modal';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    category: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setItems(response.data.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to fetch inventory items');
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
      setItems(response.data.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await inventoryAPI.update(editingItem.id, data);
        toast.success('Item updated successfully');
      } else {
        await inventoryAPI.create(data);
        toast.success('Item created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity.toString(),
      category: item.category || '',
      price: item.price.toString(),
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await inventoryAPI.delete(id);
      toast.success('Item deleted successfully');
      fetchItems();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      quantity: '',
      category: '',
      price: '',
      description: '',
    });
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Manage your stock items</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus size={20} />
          Add Item
        </button>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
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

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Item Name</th>
                <th className="table-header">Category</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Price</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                      {item.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`font-medium ${
                        item.quantity < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="table-cell font-medium">${item.price?.toLocaleString()}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500 py-8">No inventory items found</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Update Item' : 'Create Item'}
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

export default Inventory;

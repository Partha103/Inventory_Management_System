import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { staffAPI } from '../services/api';
import Modal from '../components/Modal';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: 'STAFF',
    department: '',
    phoneNumber: '',
    privileges: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await staffAPI.update(editingStaff.id, updateData);
        toast.success('Staff updated successfully');
      } else {
        await staffAPI.create(formData);
        toast.success('Staff created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      designation: member.designation,
      department: member.department || '',
      phoneNumber: member.phoneNumber || '',
      privileges: member.privileges || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await staffAPI.delete(id);
      toast.success('Staff deleted successfully');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      designation: 'STAFF',
      department: '',
      phoneNumber: '',
      privileges: '',
    });
    setEditingStaff(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus size={20} />
          Add Staff
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Designation</th>
                <th className="table-header">Department</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{member.name}</td>
                  <td className="table-cell">{member.email}</td>
                  <td className="table-cell">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.designation === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {member.designation}
                    </span>
                  </td>
                  <td className="table-cell">{member.department || '-'}</td>
                  <td className="table-cell">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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

        {staff.length === 0 && (
          <p className="text-center text-gray-500 py-8">No staff members found</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff' : 'Add New Staff'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editingStaff && '(leave empty to keep current)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                {...(!editingStaff && { required: true, minLength: 6 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="input-field"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privileges</label>
            <input
              type="text"
              value={formData.privileges}
              onChange={(e) => setFormData({ ...formData, privileges: e.target.value })}
              className="input-field"
              placeholder="e.g., INVENTORY,TRANSACTIONS"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingStaff ? 'Update Staff' : 'Create Staff'}
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

export default StaffManagement;

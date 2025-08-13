import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaMoneyBillWave, FaCalendarAlt, FaChartLine, FaSearch, FaPlus, FaEdit, FaHistory, FaTrash, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

function NewCustomers() {
  // States
  const [activeTab, setActiveTab] = useState('new');
  const [showForm, setShowForm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [editData, setEditData] = useState({});
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Branch data (can be moved to backend later)
  const branches = [
    { id: 1, name: "Downtown Branch", address: "123 Main St", phone: "(555) 123-4567" },
    { id: 2, name: "Uptown Branch", address: "456 High St", phone: "(555) 987-6543" },
    { id: 3, name: "Westside Branch", address: "789 Park Ave", phone: "(555) 456-7890" },
    { id: 4, name: "Eastside Branch", address: "321 River Rd", phone: "(555) 234-5678" }
  ];

  // Fetch customers from backend
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data);
        setError(null);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Stats calculation
  const totalCustomers = customers.length;
  const dailyContributions = customers.reduce((sum, customer) => 
    customer.status === 'active' ? sum + customer.dailyAmount : sum, 0
  );
  const totalSaved = customers.reduce((sum, customer) => sum + customer.totalSaved, 0);
  const activeDays = Math.max(...customers.map(c => c.daysActive), 0);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for new customer
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Define customerData before using it
    const customerData = {
      name: editData.name,
      phone: editData.phone,
      dailyAmount: parseInt(editData.dailyAmount),
      branchId: parseInt(editData.branchId) || 1,
      startDate: editData.startDate || new Date().toISOString().split('T')[0]
    };

    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData)
    });

    const data = await response.json();

    if (data.success) {
      setCustomers([...customers, data.data]);
      setEditData({});
      setShowForm(false);
      setError(null);
      alert('Customer created successfully!');
    } else {
      setError(data.message || 'Failed to create customer');
      alert(data.message || 'Failed to create customer');
    }
  } catch (err) {
    setError('Error creating customer');
    console.error('Create error:', err);
    alert('Error creating customer');
  } finally {
    setLoading(false);
  }
};


  // Handle edit submission
  const handleEditSubmit = async () => {
    setLoading(true);
    
    try {
      const updateData = {
        name: editData.name,
        phone: editData.phone,
        dailyAmount: parseInt(editData.dailyAmount),
        branchId: parseInt(editData.branchId),
        status: editData.status
      };

      const response = await fetch(`${API_BASE_URL}/customers/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(customers.map(c => 
          c._id === selectedCustomer._id ? data.data : c
        ));
        setShowEditModal(false);
        setError(null);
        alert('Customer updated successfully!');
      } else {
        setError(data.message || 'Failed to update customer');
        alert(data.message || 'Failed to update customer');
      }
    } catch (err) {
      setError('Error updating customer');
      console.error('Update error:', err);
      alert('Error updating customer');
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (customerId) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(customers.filter(c => c._id !== customerId));
        setError(null);
        alert('Customer deleted successfully!');
      } else {
        setError(data.message || 'Failed to delete customer');
        alert(data.message || 'Failed to delete customer');
      }
    } catch (err) {
      setError('Error deleting customer');
      console.error('Delete error:', err);
      alert('Error deleting customer');
    } finally {
      setLoading(false);
    }
  };

  // Open history modal
  const openHistory = async (customer) => {
    setSelectedCustomer(customer);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customer._id}/history`);
      const data = await response.json();
      
      if (data.success) {
        setHistoryData(data.data);
        setShowHistoryModal(true);
        setError(null);
      } else {
        setError('Failed to fetch history');
        alert('Failed to fetch customer history');
      }
    } catch (err) {
      setError('Error fetching history');
      console.error('History error:', err);
      alert('Error fetching customer history');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditData({
      name: customer.name,
      phone: customer.phone,
      dailyAmount: customer.dailyAmount,
      status: customer.status,
      branchId: customer.branchId
    });
    setShowEditModal(true);
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ice-blue-50 to-ice-blue-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Savings Management</h1>
          <p className="text-gray-700">Track and manage customer savings contributions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300">
            <div className="bg-ice-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserAlt className="text-ice-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
            <p className="text-gray-700">Total Customers</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₦{dailyContributions.toLocaleString()}</h3>
            <p className="text-gray-700">Daily Contributions</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₦{totalSaved.toLocaleString()}</h3>
            <p className="text-gray-700">Total Saved</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-orange-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{activeDays}</h3>
            <p className="text-gray-700">Max Active Days</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'new' 
                    ? 'bg-ice-blue-500 text-white' 
                    : 'bg-ice-blue-100 text-gray-700 hover:bg-ice-blue-200'
                }`}
                onClick={() => setActiveTab('new')}
              >
                New Customers
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-ice-blue-500 text-white' 
                    : 'bg-ice-blue-100 text-gray-700 hover:bg-ice-blue-200'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Customers
              </button>
            </div>
            
            <div className="flex space-x-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 pl-10 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <FaSearch />
                </div>
              </div>
              
              <button 
                className="bg-ice-blue-500 hover:bg-ice-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center transform hover:scale-105"
                onClick={() => {
                  setEditData({});
                  setShowForm(true);
                }}
                disabled={loading}
              >
                <FaPlus className="mr-2" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ice-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ice-blue-100">
              <thead className="bg-ice-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Daily Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ice-blue-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer._id} className="hover:bg-ice-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-ice-blue-100 rounded-full flex items-center justify-center text-ice-blue-700 font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.customerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₦{customer.dailyAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBuilding className="text-ice-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getBranchName(customer.branchId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEdit(customer)}
                          className="text-gray-600 hover:text-ice-blue-600 p-2 rounded-full hover:bg-ice-blue-100 transition-colors"
                          title="Edit"
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => openHistory(customer)}
                          className="text-gray-600 hover:text-ice-blue-600 p-2 rounded-full hover:bg-ice-blue-100 transition-colors"
                          title="View History"
                          disabled={loading}
                        >
                          <FaHistory />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer._id)}
                          className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCustomers.length === 0 && !loading && (
              <div className="text-center py-12 animate-fadeIn">
                <div className="bg-ice-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <FaUserAlt className="text-ice-blue-600 text-2xl" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No customers found</h3>
                <p className="mt-1 text-gray-600">Try adjusting your search or add a new customer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 animate-popIn">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
              <button 
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Daily Amount (₦) *</label>
                  <input
                    type="number"
                    name="dailyAmount"
                    value={editData.dailyAmount || ''}
                    onChange={handleInputChange}
                    required
                    min="100"
                    className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Branch</label>
                <select
                  name="branchId"
                  value={editData.branchId || '1'}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={editData.startDate || new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-ice-blue-300 text-gray-700 rounded-lg hover:bg-ice-blue-50 transition-colors"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 animate-popIn">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
              <button 
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={() => setShowEditModal(false)}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Daily Amount (₦)</label>
                  <input
                    type="number"
                    name="dailyAmount"
                    value={editData.dailyAmount || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Branch</label>
                <select
                  name="branchId"
                  value={editData.branchId || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={editData.status || 'active'}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-ice-blue-300 text-gray-700 rounded-lg hover:bg-ice-blue-50 transition-colors"
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600 transition-colors disabled:opacity-50"
                  onClick={handleEditSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-popIn">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contribution History</h3>
                <p className="text-gray-700">{selectedCustomer.name} - ₦{selectedCustomer.dailyAmount.toLocaleString()} daily</p>
                <p className="text-sm text-gray-600">Branch: {getBranchName(selectedCustomer.branchId)}</p>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={() => setShowHistoryModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-6 grid grid-cols-4 gap-4">
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">Total Contributions</p>
                  <p className="text-xl font-bold text-gray-900">{historyData.length}</p>
                </div>
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{historyData.reduce((sum, record) => sum + (record.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">On-Time Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {historyData.length > 0 ? Math.round((historyData.filter(d => d.status === 'paid').length / historyData.length) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">Start Date</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(selectedCustomer.startDate)}</p>
                </div>
              </div>
              
              {historyData.length > 0 ? (
                <div className="overflow-hidden border border-ice-blue-200 rounded-lg">
                  <table className="min-w-full divide-y divide-ice-blue-200">
                    <thead className="bg-ice-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Collected By</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-ice-blue-200">
                      {historyData.map(entry => (
                        <tr key={entry._id} className="hover:bg-ice-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{(entry.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              entry.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.collectedBy || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHistory className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No History Found</h3>
                  <p className="text-gray-600">No savings records found for this customer</p>
                </div>
              )}
            </div>
            
            <div className="bg-ice-blue-50 px-6 py-4 flex justify-end">
              <button
                className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600 transition-colors"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-popIn {
          animation: popIn 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* Custom Ice Blue Color Definitions */}
      <style jsx>{`
        :root {
          --ice-blue-50: #f0f9ff;
          --ice-blue-100: #e0f2fe;
          --ice-blue-200: #bae6fd;
          --ice-blue-300: #7dd3fc;
          --ice-blue-400: #38bdf8;
          --ice-blue-500: #0ea5e9;
          --ice-blue-600: #0284c7;
          --ice-blue-700: #0369a1;
          --ice-blue-800: #075985;
          --ice-blue-900: #0c4a6e;
        }
        
        .bg-ice-blue-50 { background-color: var(--ice-blue-50); }
        .bg-ice-blue-100 { background-color: var(--ice-blue-100); }
        .bg-ice-blue-200 { background-color: var(--ice-blue-200); }
        .bg-ice-blue-300 { background-color: var(--ice-blue-300); }
        .bg-ice-blue-400 { background-color: var(--ice-blue-400); }
        .bg-ice-blue-500 { background-color: var(--ice-blue-500); }
        .bg-ice-blue-600 { background-color: var(--ice-blue-600); }
        .bg-ice-blue-700 { background-color: var(--ice-blue-700); }
        .bg-ice-blue-800 { background-color: var(--ice-blue-800); }
        .bg-ice-blue-900 { background-color: var(--ice-blue-900); }
        
        .border-ice-blue-200 { border-color: var(--ice-blue-200); }
        .border-ice-blue-300 { border-color: var(--ice-blue-300); }
        
        .divide-ice-blue-100 > :not([hidden]) ~ :not([hidden]) {
          border-color: var(--ice-blue-100);
        }
        
        .divide-ice-blue-200 > :not([hidden]) ~ :not([hidden]) {
          border-color: var(--ice-blue-200);
        }
        
        .from-ice-blue-50 { --gradient-from-color: var(--ice-blue-50); }
        .to-ice-blue-100 { --gradient-to-color: var(--ice-blue-100); }
      `}</style>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-700 text-sm animate-fadeIn">
        <p>© {new Date().getFullYear()} Customer Records System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NewCustomers;
import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaMoneyBillWave, FaCalendarAlt, FaChartLine, FaSearch, FaPlus, FaEdit, FaHistory, FaTrash } from 'react-icons/fa';

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
  
  // Sample data
  const [customers, setCustomers] = useState([
    { id: 1, name: "Sarah Johnson", phone: "555-123-4567", dailyAmount: 500, totalSaved: 12500, daysActive: 25, status: "active", startDate: "2023-05-15" },
    { id: 2, name: "Michael Chen", phone: "555-987-6543", dailyAmount: 1000, totalSaved: 30000, daysActive: 30, status: "active", startDate: "2023-04-10" },
    { id: 3, name: "Emma Rodriguez", phone: "555-456-7890", dailyAmount: 750, totalSaved: 15000, daysActive: 20, status: "paused", startDate: "2023-06-01" },
    { id: 4, name: "David Wilson", phone: "555-234-5678", dailyAmount: 1500, totalSaved: 45000, daysActive: 30, status: "active", startDate: "2023-03-22" },
    { id: 5, name: "Olivia Smith", phone: "555-876-5432", dailyAmount: 500, totalSaved: 5000, daysActive: 10, status: "active", startDate: "2023-06-20" },
  ]);
  
  // Stats calculation
  const totalCustomers = customers.length;
  const dailyContributions = customers.reduce((sum, customer) => customer.status === 'active' ? sum + customer.dailyAmount : sum, 0);
  const totalSaved = customers.reduce((sum, customer) => sum + customer.totalSaved, 0);
  const activeDays = Math.max(...customers.map(c => c.daysActive), 0);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for new customer
  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      name: editData.name,
      phone: editData.phone,
      dailyAmount: parseInt(editData.dailyAmount),
      totalSaved: 0,
      daysActive: 0,
      status: "active",
      startDate: editData.startDate || new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
    setEditData({});
    setShowForm(false);
  };

  // Handle edit submission
  const handleEditSubmit = () => {
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id ? { ...c, ...editData, dailyAmount: parseInt(editData.dailyAmount) } : c
    ));
    setShowEditModal(false);
  };

  // Open history modal
  const openHistory = (customer) => {
    setSelectedCustomer(customer);
    
    // Generate sample history data
    const history = [];
    const startDate = new Date(customer.startDate);
    for (let i = 0; i < customer.daysActive; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      history.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        amount: customer.dailyAmount,
        status: Math.random() > 0.1 ? 'paid' : 'missed',
        collector: ['John Doe', 'Jane Smith', 'Robert Johnson'][Math.floor(Math.random() * 3)]
      });
    }
    
    setHistoryData(history);
    setShowHistoryModal(true);
  };

  // Open edit modal
  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditData({
      name: customer.name,
      phone: customer.phone,
      dailyAmount: customer.dailyAmount,
      status: customer.status
    });
    setShowEditModal(true);
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-ice-blue-50 to-ice-blue-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Savings Management</h1>
          <p className="text-gray-700">Track and manage customer savings contributions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Customers", value: totalCustomers, icon: FaUserAlt },
            { title: "Daily Contributions", value: `₦${dailyContributions.toLocaleString()}`, icon: FaMoneyBillWave },
            { title: "Total Saved", value: `₦${totalSaved.toLocaleString()}`, icon: FaChartLine },
            { title: "Active Days", value: activeDays, icon: FaCalendarAlt }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center transition-transform duration-300 hover:scale-105">
              <div className="bg-ice-blue-100 p-4 rounded-full mr-4">
                <stat.icon className="text-ice-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-700 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'new' 
                    ? 'bg-ice-blue-500 text-white' 
                    : 'bg-ice-blue-100 text-gray-700 hover:bg-ice-blue-200'
                }`}
                onClick={() => setActiveTab('new')}
              >
                New Customers
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${
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
                className="bg-ice-blue-500 hover:bg-ice-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
                onClick={() => {
                  setEditData({});
                  setShowForm(true);
                }}
              >
                <FaPlus className="mr-2" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ice-blue-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-ice-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-ice-blue-100 rounded-full flex items-center justify-center text-ice-blue-700 font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
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
                          className="text-gray-600 hover:text-ice-blue-600 p-2 rounded-full hover:bg-ice-blue-100"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => openHistory(customer)}
                          className="text-gray-600 hover:text-ice-blue-600 p-2 rounded-full hover:bg-ice-blue-100"
                          title="View History"
                        >
                          <FaHistory />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowForm(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
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
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={editData.startDate || new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-ice-blue-300 text-gray-700 rounded-lg hover:bg-ice-blue-50"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditModal(false)}
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
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={editData.status || 'active'}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-ice-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-ice-blue-300 text-gray-700 rounded-lg hover:bg-ice-blue-50"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600"
                  onClick={handleEditSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-ice-blue-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contribution History</h3>
                <p className="text-gray-700">{selectedCustomer.name} - ₦{selectedCustomer.dailyAmount.toLocaleString()} daily</p>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-500"
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
                  <p className="text-xl font-bold text-gray-900">₦{(historyData.length * selectedCustomer.dailyAmount).toLocaleString()}</p>
                </div>
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">On-Time Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round((historyData.filter(d => d.status === 'paid').length / historyData.length) * 100)}%
                  </p>
                </div>
                <div className="bg-ice-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">Start Date</p>
                  <p className="text-xl font-bold text-gray-900">{selectedCustomer.startDate}</p>
                </div>
              </div>
              
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
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{entry.amount.toLocaleString()}
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
                          {entry.collector}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-ice-blue-50 px-6 py-4 flex justify-end">
              <button
                className="px-4 py-2 bg-ice-blue-500 text-white rounded-lg hover:bg-ice-blue-600"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
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
    </div>
  );
}

export default NewCustomers;
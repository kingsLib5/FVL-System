import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AddCustomerRecord() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerInput, setCustomerInput] = useState('');

  const [newRecord, setNewRecord] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const dropdownRef = useRef(null);

  // For editing
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editingRecordData, setEditingRecordData] = useState({
    amount: '',
    date: '',
  });

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await axios.get('https://fvl-system-backend.onrender.com/api/customers');
        const customersArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setCustomers(customersArray);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomers([]);
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    async function fetchSavings() {
      try {
        const res = await axios.get('https://fvl-system-backend.onrender.com/api/savings');
        const recordsArray = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setRecords(recordsArray);
      } catch (err) {
        console.error('Error fetching savings records:', err);
      }
    }
    fetchSavings();
  }, []);

  useEffect(() => {
    if (customerInput.trim() === '') {
      setFilteredCustomers([]);
      setShowDropdown(false);
      setSelectedCustomerId('');
      return;
    }

    const filtered = customers.filter(cust =>
      cust.name.toLowerCase().includes(customerInput.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowDropdown(filtered.length > 0);

    const exactMatch = customers.find(c => c.name.toLowerCase() === customerInput.toLowerCase());
    if (!exactMatch) {
      setSelectedCustomerId('');
    } else {
      setSelectedCustomerId(exactMatch._id);
    }
  }, [customerInput, customers]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomerInputChange = (e) => {
    setCustomerInput(e.target.value);
  };

  const handleCustomerSelect = (customer) => {
    setCustomerInput(customer.name);
    setSelectedCustomerId(customer._id);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert('Please select a valid customer from the list.');
      return;
    }

    if (!newRecord.amount || isNaN(newRecord.amount) || Number(newRecord.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const payload = {
        customerId: selectedCustomerId,
        amount: parseFloat(newRecord.amount),
        date: newRecord.date,
        status: 'paid',
      };

      const res = await axios.post('https://fvl-system-backend.onrender.com/api/savings', payload);
      const savedRecord = res.data.data || res.data;

      // The key fix here: Attach full customer object to savedRecord so name shows immediately
      const customerObj = customers.find(c => c._id === savedRecord.customerId);
      savedRecord.customerId = customerObj || { name: '' };

      setRecords(prev => [savedRecord, ...prev]);

      setCustomerInput('');
      setSelectedCustomerId('');
      setNewRecord({
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error saving record:', err);
      alert('Failed to save record. Please try again.');
    }
  };

  // Start editing a record: populate editing data
  const startEditing = (record) => {
    setEditingRecordId(record._id || record.id);
    setEditingRecordData({
      amount: record.amount,
      date: new Date(record.date).toISOString().split('T')[0],
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRecordId(null);
    setEditingRecordData({ amount: '', date: '' });
  };

  // Handle changes while editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingRecordData(prev => ({ ...prev, [name]: value }));
  };

  // Save edited record
  const saveEdit = async (id) => {
    if (!editingRecordData.amount || isNaN(editingRecordData.amount) || Number(editingRecordData.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    try {
      const payload = {
        amount: parseFloat(editingRecordData.amount),
        date: editingRecordData.date,
      };

      const res = await axios.put(`https://fvl-system-backend.onrender.com/api/savings/${id}`, payload);
      const updatedRecord = res.data.data || res.data;

      // Update local records array
      setRecords(prev =>
        prev.map(rec => (rec._id === id || rec.id === id ? { ...rec, ...updatedRecord } : rec))
      );

      cancelEditing();
    } catch (err) {
      console.error('Error updating record:', err);
      alert('Failed to update record. Please try again.');
    }
  };

  // Delete record
  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`https://fvl-system-backend.onrender.com/api/savings/${id}`);
      setRecords(prev => prev.filter(rec => rec._id !== id && rec.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record. Please try again.');
    }
  };

  // Filter savings records by searchTerm (filter by customer name)
  const filteredRecords = Array.isArray(records)
    ? records.filter(record => {
        const custName = record.customerId?.name || record.customer || '';
        return custName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Savings Records</h1>
          <p className="text-gray-600 mt-2">Track daily savings contributions</p>
        </header>

        {/* Search and Add Record Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Search Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Customers</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Add New Record */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Record</h2>
            <form onSubmit={handleSubmit} autoComplete="off" ref={dropdownRef}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer"
                    value={customerInput}
                    onChange={handleCustomerInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter name"
                    required
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <ul className="absolute z-50 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto w-full shadow-lg">
                      {filteredCustomers.map(cust => (
                        <li
                          key={cust._id || cust.id}
                          onClick={() => handleCustomerSelect(cust)}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white"
                        >
                          {cust.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    name="amount"
                    value={newRecord.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newRecord.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Add Savings Record
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Savings Records</h2>
            <p className="text-gray-600 mt-1">{filteredRecords.length} records found</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount (₦)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => {
                    const isEditing = editingRecordId === (record._id || record.id);
                    return (
                      <tr
                        key={record._id || record.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              {(record.customerId?.name || record.customer || ' ')[0]?.toUpperCase()}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.customerId?.name || record.customer}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              name="amount"
                              value={editingRecordData.amount}
                              onChange={handleEditChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <div className="text-sm text-gray-900 font-medium">
                              ₦{Number(record.amount).toLocaleString()}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {isEditing ? (
                            <input
                              type="date"
                              name="date"
                              value={editingRecordData.date}
                              onChange={handleEditChange}
                              className="p-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(record._id || record.id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(record)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteRecord(record._id || record.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new record.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredRecords.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min(filteredRecords.length, 5)}</span> of{' '}
                  <span className="font-medium">{filteredRecords.length}</span> records
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-700 text-sm animate-fadeIn">
        <p>© {new Date().getFullYear()} Customer Records System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AddCustomerRecord;

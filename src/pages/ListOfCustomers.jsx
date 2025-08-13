import React, { useState, useEffect } from 'react';

function ListOfCustomers() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const customersRes = await fetch('https://fvl-system-backend.onrender.com/api/customers');
        const customersData = await customersRes.json();
        console.log('customersData:', customersData); // for debugging

        setCustomers(customersData.data); // <--- use .data here

        const transactionsRes = await fetch('https://fvl-system-backend.onrender.com/api/savings');
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    }
    fetchData();
  }, []);

  // Filter and sort customers
  const filteredCustomers = customers.filter(c => {
    const name = c.name || '';
    const phone = c.phone || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || phone.includes(searchQuery);
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setAnimateRow(customer.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCustomer(null);
      setAnimateRow(null);
    }, 300);
  };

  // Get transactions of selected customer
  const customerTransactions = selectedCustomer && Array.isArray(transactions)
    ? transactions.filter(txn => txn.customerId === selectedCustomer._id)
    : [];

  // Status badge styles helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      case 'New':
        return 'bg-sky-100 text-sky-800 border border-sky-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseOnce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-modal-in {
          animation: modalIn 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        .animate-pulse-once {
          animation: pulseOnce 0.6s ease-out;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .search-glow:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 15px rgba(59, 130, 246, 0.2);
        }
        .button-glow {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .button-glow:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }
        .table-row-hover {
          transition: all 0.2s ease;
        }
        .table-row-hover:hover {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05));
          transform: scale(1.001);
        }
        .modal-backdrop {
          backdrop-filter: blur(8px);
          background: rgba(15, 23, 42, 0.4);
        }
        .status-badge {
          font-weight: 600;
          letter-spacing: 0.025em;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .customer-avatar {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
          font-weight: 700;
        }
        .icon-hover {
          transition: transform 0.2s ease;
        }
        .icon-hover:hover {
          transform: scale(1.1);
        }
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-3 animate-fade-in bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-slate-600 text-lg animate-fade-in animation-delay-100 font-medium">
            Manage and view customer information with ease
          </p>
        </header>

        <div className="glassmorphism rounded-2xl card-shadow p-8 mb-8 animate-fade-in-up hover-lift">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="w-full lg:w-2/3">
              <label className="block text-slate-800 font-semibold mb-3 text-sm uppercase tracking-wide">
                Search Customers
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 px-5 text-black font-medium focus:outline-none focus:border-blue-400 pl-12 transition-all duration-300 search-glow shadow-sm"
                />
                <div className="absolute left-4 top-4 text-slate-400 icon-hover">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors icon-hover"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6m0 12L6 6" />
                    </svg>
                  </button>
                )}
              </div>dev
            </div>

            <div className="w-full lg:w-auto flex justify-end">
              <a href="/fisuny-record/new-customers">
                <button className="button-glow text-white font-semibold py-4 px-8 rounded-xl flex items-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 font-medium">
                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Customer
              </button>
              </a>
             
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl card-shadow overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Customer Directory</h2>
            <p className="text-sm text-slate-600 mt-1">{filteredCustomers.length} customers found</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition-all duration-200 hover:bg-slate-100 group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Customer
                      <div className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {sortConfig.key === 'name' && (
                          <svg className={`h-4 w-4 transition-transform duration-200 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                        {sortConfig.key !== 'name' && (
                          <svg className="h-4 w-4 opacity-0 group-hover:opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition-all duration-200 hover:bg-slate-100 group"
                    onClick={() => handleSort('lastVisit')}
                  >
                    <div className="flex items-center">
                      Last Visit
                      <div className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {sortConfig.key === 'lastVisit' && (
                          <svg className={`h-4 w-4 transition-transform duration-200 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                        {sortConfig.key !== 'lastVisit' && (
                          <svg className="h-4 w-4 opacity-0 group-hover:opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    className={`table-row-hover ${animateRow === customer.id ? 'animate-pulse-once' : ''}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 customer-avatar rounded-full flex items-center justify-center text-blue-700 text-lg">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                          <div className="text-xs text-slate-500 font-medium">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-900 font-medium">
                          <svg className="h-4 w-4 text-slate-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="h-4 w-4 text-slate-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </div>
                      {customer.lastVisit && (
                        <div className="text-xs text-slate-500">
                          {new Date(customer.lastVisit).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full status-badge ${getStatusStyle(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCustomerSelect(customer)}
                        className="text-blue-600 hover:text-blue-900 font-semibold transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 px-2 py-1 rounded"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No customers found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or add a new customer.</p>
            </div>
          )}
        </div>

        {isModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
              <div className="absolute inset-0 modal-backdrop animate-fade-in"></div>
            </div>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <div className="inline-block glassmorphism rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-5xl sm:w-full animate-modal-in">
                <div className="bg-gradient-to-r from-white to-blue-50 px-6 pt-6 pb-4 sm:p-8 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-20 customer-avatar rounded-full flex items-center justify-center text-3xl text-blue-700 animate-bounce-in">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div className="ml-6">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                          {selectedCustomer.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-slate-600 font-medium">
                            ID: <span className="font-semibold">{selectedCustomer.id}</span>
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-medium">
                            Branch: <span className="font-semibold">{selectedCustomer.branchName || 'N/A'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={closeModal} 
                      className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-white px-6 py-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Contact Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-slate-600">Email Address</p>
                              <p className="text-slate-900 font-semibold">{selectedCustomer.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-slate-600">Phone Number</p>
                              <p className="text-slate-900 font-semibold">{selectedCustomer.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Transaction History
                        </h4>
                        {customerTransactions.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-slate-600 font-medium">No transactions found</p>
                            <p className="text-sm text-slate-500">This customer hasn't made any transactions yet.</p>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                  {customerTransactions.map(txn => (
                                    <tr key={txn.id} className="hover:bg-blue-50 transition-colors duration-150">
                                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {new Date(txn.date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-right font-semibold text-slate-900">${txn.amount.toFixed(2)}</td>
                                      <td className="px-4 py-3 text-sm text-right text-slate-900">{txn.items}</td>
                                      <td className="px-4 py-3 text-sm text-slate-700">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                          {txn.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 sm:px-8 border-t border-slate-200">
                  <div className="flex justify-end">
                    <button
                      onClick={closeModal}
                      className="bg-white border-2 border-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 mr-3"
                    >
                      Close
                    </button>
                    <button className="button-glow text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      Edit Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListOfCustomers;
import React, { useState, useEffect } from 'react';

function ListOfCustomers() {
  const branches = [
    { id: 1, name: "Downtown Branch", customers: 42 },
    { id: 2, name: "Westside Branch", customers: 28 },
    { id: 3, name: "East End Branch", customers: 35 },
    { id: 4, name: "North Plaza Branch", customers: 19 },
  ];

  const customers = [
    { id: 1, name: "Sarah Johnson",  email: "sarah@example.com",  phone: "(555) 123-4567", status: "Active",   lastVisit: "2023-06-15", branchId: 1 },
    { id: 2, name: "Michael Chen",   email: "michael@example.com", phone: "(555) 987-6543", status: "Active",   lastVisit: "2023-06-18", branchId: 1 },
    { id: 3, name: "Emma Rodriguez", email: "emma@example.com",    phone: "(555) 456-7890", status: "Inactive", lastVisit: "2023-05-10", branchId: 1 },
    { id: 4, name: "David Wilson",   email: "david@example.com",   phone: "(555) 234-5678", status: "Active",   lastVisit: "2023-06-20", branchId: 2 },
    { id: 5, name: "Olivia Smith",   email: "olivia@example.com",   phone: "(555) 876-5432", status: "New",      lastVisit: "2023-06-22", branchId: 2 },
    { id: 6, name: "James Brown",    email: "james@example.com",    phone: "(555) 345-6789", status: "Active",   lastVisit: "2023-06-19", branchId: 3 },
    { id: 7, name: "Sophia Garcia",  email: "sophia@example.com",  phone: "(555) 765-4321", status: "Inactive", lastVisit: "2023-04-28", branchId: 3 },
    { id: 8, name: "William Taylor", email: "william@example.com", phone: "(555) 567-8901", status: "Active",   lastVisit: "2023-06-21", branchId: 4 },
  ];

  const transactions = [
    { id: 1, customerId: 1, date: "2023-06-15", amount: 124.50, items: 3, status: "Completed" },
    { id: 2, customerId: 1, date: "2023-05-22", amount:  89.99, items: 2, status: "Completed" },
    { id: 3, customerId: 1, date: "2023-04-30", amount: 210.75, items: 5, status: "Completed" },
    { id: 4, customerId: 2, date: "2023-06-18", amount:  55.25, items: 1, status: "Completed" },
    { id: 5, customerId: 2, date: "2023-05-05", amount: 320.40, items: 4, status: "Completed" },
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortConfig, setSortConfig]         = useState({ key: 'name', direction: 'ascending' });
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [animateRow, setAnimateRow]         = useState(null);

  const filteredCustomers = customers
    .filter(c => c.branchId === selectedBranch.id)
    .filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
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

  const customerTransactions = selectedCustomer
    ? transactions.filter(t => t.customerId === selectedCustomer.id)
    : [];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active':   return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'New':      return 'bg-blue-100 text-blue-800';
      default:         return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ice-blue-50 to-ice-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2 animate-fade-in">Customer Management</h1>
          <p className="text-gray-700 animate-fade-in animation-delay-100">Manage and view customer information across branches</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-gray-700 font-medium mb-2">Select Branch</label>
              <div className="relative">
                <select
                  value={selectedBranch.id}
                  onChange={(e) => setSelectedBranch(branches.find(b => b.id === parseInt(e.target.value)))}
                  className="w-full md:w-64 bg-white border border-ice-blue-300 rounded-lg py-3 px-4 text-black focus:outline-none focus:ring-2 focus:ring-ice-blue-500 transition-all duration-200"
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.customers} customers)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-gray-700 font-medium mb-2">Search Customers</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-ice-blue-300 rounded-lg py-3 px-4 text-black focus:outline-none focus:ring-2 focus:ring-ice-blue-500 pl-10 transition-all duration-200"
                />
                <div className="absolute left-3 top-3 text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-end">
              <button className="bg-ice-blue-500 hover:bg-ice-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ice-blue-500">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Customer
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-ice-blue-400 to-ice-blue-600 text-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in-up animation-delay-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedBranch.name}</h2>
              <p className="text-ice-blue-100">
                {filteredCustomers.length} customers • {branches.find(b => b.id === selectedBranch.id)?.customers} total
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-ice-blue-200">Branch Address</p>
                <p>123 Commerce St, Downtown</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up animation-delay-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ice-blue-100">
              <thead className="bg-ice-blue-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortConfig.key === 'name' && (
                        <svg className={`h-4 w-4 ml-1 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24">
                          <path d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                    onClick={() => handleSort('lastVisit')}
                  >
                    <div className="flex items-center">
                      Last Visit
                      {sortConfig.key === 'lastVisit' && (
                        <svg className={`h-4 w-4 ml-1 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24">
                          <path d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ice-blue-100">
                {filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className={`hover:bg-ice-blue-50 transition-all duration-200 ${animateRow === customer.id ? 'animate-pulse-once' : ''}`}
                  >
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
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(customer.lastVisit).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusStyle(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleCustomerSelect(customer)}
                        className="text-ice-blue-600 hover:text-ice-blue-900 mr-4 transition-colors duration-200"
                      >
                        View Details
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="mt-4 text-lg font-medium text-gray-900">No customers found</h3>
            </div>
          )}
        </div>

        {isModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
              <div className="absolute inset-0 bg-ice-blue-900 bg-opacity-75 animate-fade-in"></div>
            </div>
            <div className="flex items-center justify-center min-h-screen">
              <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full animate-modal-in">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-ice-blue-100 sm:mx-0 sm:h-20 sm:w-20 animate-bounce-in">
                      <span className="text-2xl font-bold text-ice-blue-700">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl leading-6 font-bold text-gray-900">
                            {selectedCustomer.name}
                          </h3>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              Customer ID: {selectedCustomer.id} • Branch: {branches.find(b => b.id === selectedCustomer.branchId)?.name}
                            </p>
                          </div>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                          <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-ice-blue-500 mr-2" viewBox="0 0 24 24">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-800">{selectedCustomer.email}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-ice-blue-500 mr-2" viewBox="0 0 24 24">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-gray-800">{selectedCustomer.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-ice-blue-500 mr-2" viewBox="0 0 24 24">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-gray-800">123 Main Street, Anytown, ST 12345</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-ice-blue-500 mr-2" viewBox="0 0 24 24">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-800">
                                Joined: {new Date('2023-01-15').toLocaleDateString()} • Last Visit: {new Date(selectedCustomer.lastVisit).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Stats</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-ice-blue-50 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
                              <p className="text-sm text-gray-700">Total Spending</p>
                              <p className="text-xl font-bold text-gray-900">$1,245.75</p>
                            </div>
                            <div className="bg-ice-blue-50 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
                              <p className="text-sm text-gray-700">Total Orders</p>
                              <p className="text-xl font-bold text-gray-900">12</p>
                            </div>
                            <div className="bg-ice-blue-50 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
                              <p className="text-sm text-gray-700">Average Order</p>
                              <p className="text-xl font-bold text-gray-900">$103.81</p>
                            </div>
                            <div className="bg-ice-blue-50 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
                              <p className="text-sm text-gray-700">Status</p>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(selectedCustomer.status)}`}>
                                {selectedCustomer.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">... further modal content ...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes pulseOnce { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animate-modal-in { animation: modalIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
        .animate-pulse-once { animation: pulseOnce 0.3s ease-in-out; }
        .bg-ice-blue-50 { background-color: var(--ice-blue-50); }
        .bg-ice-blue-100 { background-color: var(--ice-blue-100); }
        .bg-ice-blue-200 { background-color: var(--ice-blue-200); }
        .bg-ice-blue-400 { background-color: var(--ice-blue-400); }
        .bg-ice-blue-600 { background-color: var(--ice-blue-600); }
        .text-ice-blue-100 { color: var(--ice-blue-100); }
        .text-ice-blue-200 { color: var(--ice-blue-200); }
        .text-ice-blue-500 { color: var(--ice-blue-500); }
        .text-ice-blue-700 { color: var(--ice-blue-700); }
        .text-ice-blue-900 { color: var(--ice-blue-900); }
        .border-ice-blue-200 { border-color: var(--ice-blue-200); }
        .divide-ice-blue-100 > :not([hidden]) ~ :not([hidden]) { border-color: var(--ice-blue-100); }
        .divide-ice-blue-200 > :not([hidden]) ~ :not([hidden]) { border-color: var(--ice-blue-200); }
      `}</style>
    </div>
  );
}

export default ListOfCustomers;

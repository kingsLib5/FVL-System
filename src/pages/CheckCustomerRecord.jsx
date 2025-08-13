import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaUser, FaMoneyBillWave, FaFilter, FaChartLine, FaChevronDown } from 'react-icons/fa';

function CheckCustomerRecord() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [customerRecords, setCustomerRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://fvl-system-backend.onrender.com/api/savings');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          setCustomerRecords(json.data);
        } else {
          setCustomerRecords([]);
          setError('Unexpected data format from API');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch records');
        setCustomerRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  const uniqueYears = Array.isArray(customerRecords)
    ? [...new Set(customerRecords.map(record => new Date(record.date).getFullYear()))].sort((a, b) => b - a)
    : [];

  useEffect(() => {
    setAnimate(true);
    let results = [...customerRecords];

    if (searchTerm) {
      results = results.filter(record => 
        record.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (yearFilter !== 'all') {
      results = results.filter(record => new Date(record.date).getFullYear() === parseInt(yearFilter));
    }
    if (monthFilter !== 'all') {
      results = results.filter(record => (new Date(record.date).getMonth() + 1) === parseInt(monthFilter));
    }
    if (dayFilter !== 'all') {
      results = results.filter(record => new Date(record.date).getDate() === parseInt(dayFilter));
    }

    setFilteredRecords(results);

    const total = results.reduce((sum, record) => sum + Number(record.amount || 0), 0);
    setSummary({ total, count: results.length });

    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, yearFilter, monthFilter, dayFilter, customerRecords]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setYearFilter('all');
    setMonthFilter('all');
    setDayFilter('all');
  };

  const generateMonthlySummary = () => {
    const monthCounts = Array(12).fill(0);
    filteredRecords.forEach(record => {
      const month = new Date(record.date).getMonth();
      monthCounts[month]++;
    });
    return monthCounts.map((count, index) => ({
      month: getMonthName(index + 1),
      count
    }));
  };

  const getTopCustomers = () => {
    const customerTotals = {};
    filteredRecords.forEach(record => {
      const name = record.customerId?.name || 'Unknown';
      if (!customerTotals[name]) {
        customerTotals[name] = 0;
      }
      customerTotals[name] += Number(record.amount || 0);
    });
    const sortedCustomers = Object.entries(customerTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total], index) => ({
        id: index,
        name,
        total
      }));
    return sortedCustomers;
  };

  if (loading) return <div className="p-8 text-center">Loading customer records...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center transform transition-all duration-500 ease-in-out">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-fadeIn">
            Customer Records Checker
          </h1>
          <p className="text-gray-700 animate-fadeIn delay-100">
            Search and filter customer savings records
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Search Records</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-blue-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              <FaFilter className="text-sm" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <FaChevronDown className={`text-xs transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="mb-6 animate-fadeIn">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Search Customer Records
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-900"
              />
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-900"
                >
                  <option value="all">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Month
                </label>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-900"
                >
                  <option value="all">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Day
                </label>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-900"
                >
                  <option value="all">All Days</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors transform hover:scale-[1.03]"
            >
              <FaFilter className="text-sm" /> Reset Filters
            </button>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-blue-100 rounded-lg px-4 py-2 flex items-center transition-all duration-300 hover:bg-blue-200">
                <FaUser className="text-gray-800 mr-2" />
                <span className="text-gray-800 font-medium">
                  {summary.count} {summary.count === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              <div className="bg-blue-100 rounded-lg px-4 py-2 flex items-center transition-all duration-300 hover:bg-blue-200">
                <FaMoneyBillWave className="text-gray-800 mr-2" />
                <span className="text-gray-800 font-medium">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${animate ? 'animate-pulse' : ''}`}>
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Customer Savings Records</h2>
                <p className="text-gray-700">
                  Showing records for {searchTerm ? `"${searchTerm}"` : 'all customers'} 
                  {yearFilter !== 'all' ? ` in ${yearFilter}` : ''}
                  {monthFilter !== 'all' ? `, ${getMonthName(monthFilter)}` : ''}
                  {dayFilter !== 'all' ? `, ${dayFilter}` : ''}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-700">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Month
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => {
                    const recordDate = new Date(record.date);
                    const year = recordDate.getFullYear();
                    const month = recordDate.getMonth() + 1;
                    const customerName = record.customerId?.name || '?';

                    return (
                      <tr 
                        key={record._id || index} 
                        className={`transition-all duration-300 hover:bg-blue-50 ${animate ? 'opacity-0' : 'opacity-100'}`}
                        style={{ 
                          animation: !animate ? `fadeIn 0.5s ease-out ${index * 0.05}s forwards` : 'none' 
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center mr-3 font-medium">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{customerName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 font-medium">{formatCurrency(record.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-gray-800">
                            {year}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-gray-800">
                            {getMonthName(month)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                          <FaSearch className="text-gray-800 text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No matching records found</h3>
                        <p className="text-gray-700 max-w-md">
                          Try adjusting your search or date filters. No records match your current criteria.
                        </p>
                        <button
                          onClick={resetFilters}
                          className="mt-4 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors transform hover:scale-[1.03]"
                        >
                          <FaFilter className="text-sm" /> Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredRecords.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1-{Math.min(filteredRecords.length, 10)}</span> of{' '}
                <span className="font-medium">{filteredRecords.length}</span> records
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Records by Month</h3>
              <FaChartLine className="text-gray-800" />
            </div>
            <div className="space-y-4">
              {generateMonthlySummary().map(item => (
                <div key={item.month} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.month}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers by Total Amount</h3>
              <FaUser className="text-gray-800" />
            </div>
            <div className="space-y-4">
              {getTopCustomers().map(customer => (
                <div key={customer.id} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{customer.name}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {formatCurrency(customer.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckCustomerRecord;

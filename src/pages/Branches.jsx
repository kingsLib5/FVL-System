import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGlobe, FaUsers, FaBuilding } from 'react-icons/fa';

function Branches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  
  // Mock branch data
  const branches = [
    {
      id: 1,
      name: "Downtown Headquarters",
      address: "123 Main Street, New York, NY 10001",
      phone: "(212) 555-1234",
      email: "downtown@business.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM",
      manager: "Sarah Johnson",
      employees: 24,
      status: "active",
      established: "2015"
    },
    {
      id: 2,
      name: "Financial District Branch",
      address: "456 Wall Street, New York, NY 10005",
      phone: "(212) 555-5678",
      email: "financial@business.com",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM",
      manager: "Michael Chen",
      employees: 18,
      status: "active",
      established: "2018"
    },
    {
      id: 3,
      name: "Midtown Office",
      address: "789 Broadway, New York, NY 10003",
      phone: "(212) 555-9012",
      email: "midtown@business.com",
      hours: "Mon-Fri: 8:30 AM - 7:00 PM, Sun: 11:00 AM - 4:00 PM",
      manager: "Jessica Williams",
      employees: 32,
      status: "active",
      established: "2016"
    },
    {
      id: 4,
      name: "Brooklyn Location",
      address: "321 Park Place, Brooklyn, NY 11217",
      phone: "(718) 555-3456",
      email: "brooklyn@business.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM",
      manager: "David Rodriguez",
      employees: 15,
      status: "active",
      established: "2019"
    },
    {
      id: 5,
      name: "Queens Expansion",
      address: "654 Queens Blvd, Queens, NY 11377",
      phone: "(718) 555-7890",
      email: "queens@business.com",
      hours: "Mon-Fri: 10:00 AM - 8:00 PM",
      manager: "Amanda Thompson",
      employees: 22,
      status: "active",
      established: "2020"
    },
    {
      id: 6,
      name: "New Jersey Branch",
      address: "987 Hudson Street, Hoboken, NJ 07030",
      phone: "(201) 555-2345",
      email: "newjersey@business.com",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      manager: "Robert Davis",
      employees: 12,
      status: "active",
      established: "2021"
    }
  ];

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Business Branches</h1>
          <p className="text-gray-700">Manage and explore our network of locations</p>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center border border-blue-100">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaBuilding className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center border border-blue-100">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{branches.reduce((sum, branch) => sum + branch.employees, 0)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center border border-blue-100">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaGlobe className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">3 States</p>
            </div>
          </div>
        </div>
        
        {/* Search and Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search branches by name, location, or manager..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-900"
              />
            </div>
            
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'map' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Map View
              </button>
            </div>
          </div>
          
          {/* Branch Cards */}
          {activeTab === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map(branch => (
                <div 
                  key={branch.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{branch.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {branch.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <p className="text-gray-700">{branch.address}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-3 flex-shrink-0" />
                        <p className="text-gray-700">{branch.phone}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3 flex-shrink-0" />
                        <p className="text-gray-700">{branch.email}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <FaClock className="text-gray-500 mr-3 flex-shrink-0" />
                        <p className="text-gray-700">{branch.hours}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Manager</p>
                        <p className="font-medium text-gray-900">{branch.manager}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Employees</p>
                        <p className="font-medium text-gray-900">{branch.employees}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Map View
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Branch Locations Map</h3>
                
                {/* Map Placeholder - In a real app, this would be a map component */}
                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-blue-500 text-4xl mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Interactive Map View</p>
                    <p className="text-gray-500 mt-2">Branches would appear as markers on the map</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {filteredBranches.map(branch => (
                    <div key={branch.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3 mt-1">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{branch.name}</h4>
                        <p className="text-sm text-gray-600">{branch.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Branch Growth Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Branch Expansion Timeline</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 transform translate-x-1/2"></div>
            
            <div className="space-y-8">
              {branches
                .sort((a, b) => new Date(a.established) - new Date(b.established))
                .map((branch, index) => (
                  <div key={branch.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-4 w-8 h-8 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Established: {branch.established}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{branch.address}</p>
                      <div className="mt-4 flex items-center">
                        <FaUsers className="text-gray-500 mr-2" />
                        <span className="text-gray-700">{branch.employees} employees</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Business Branch Network. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Branches;
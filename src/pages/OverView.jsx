// OverView.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa6';
import { IoGitBranchOutline } from 'react-icons/io5';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import {
  HiOutlineInformationCircle,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineArrowNarrowUp,
} from 'react-icons/hi';

function OverView() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
    const [totalCustomers, setTotalCustomers] = useState(0);

   useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
      setCurrentDay(
        now.toLocaleDateString('en-US', { weekday: 'long' })
      );
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);
    
    // Fetch customers count once on mount
    const fetchTotalCustomers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customers');
        const data = await res.json();
        // Assuming data.data is an array of customers
        if (Array.isArray(data.data)) {
          setTotalCustomers(data.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch total customers:', error);
      }
    };

    fetchTotalCustomers();

    return () => clearInterval(timerId);
  }, []);


  const iceBlue = { gradient: 'from-[#81D4FA] to-[#039BE5]' };

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(), // dynamic number formatted with commas
      Icon: HiOutlineUsers
    },
  ];

  const actions = [
    // absolute paths under /fisuny-record
    { title: 'LOC',           Icon: FaClipboardList,        path: '/fisuny-record/customers-list' },
    { title: 'Add to CR',     Icon: FaPlus,                 path: '/fisuny-record/create-record' },
    { title: 'New Customers', Icon: MdOutlineCreateNewFolder, path: '/fisuny-record/new-customers' },
    { title: 'Branchs',       Icon: IoGitBranchOutline,     path: '/#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 text-black">
      {/* Top Section */}
      <div className="h-[30vh] flex mb-6">
        <div className="w-[70%] bg-white rounded-xl shadow-md p-6 mr-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-fadeIn">
              Welcome Back, Fisuny!
            </h1>
            <p className="animate-fadeIn animation-delay-100">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center animate-fadeIn animation-delay-200">
            <div className="bg-[#E1F5FE] rounded-full p-3 mr-4 transition-all duration-300 hover:scale-110">
              <HiOutlineInformationCircle className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="w-[30%] grid grid-cols-2 gap-4">
          <div className={`bg-gradient-to-r ${iceBlue.gradient} rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-[1.02] animate-float`}>
            <HiOutlineClock className="h-12 w-12 text-black" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-white rounded-xl shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <div className="text-center animate-fadeIn">
                <p className="text-2xl font-bold">{currentTime}</p>
                <p className="text-sm">Current Time</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <div className="text-center animate-fadeIn animation-delay-100">
                <p className="text-xl font-semibold">{currentDate}</p>
                <p className="text-sm">{currentDay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="h-[70vh] grid grid-rows-2 gap-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fadeIn"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p>{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="bg-[#E1F5FE] p-3 rounded-lg transition-all duration-300 hover:scale-110">
                  <stat.Icon className="h-6 w-6 text-black" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <HiOutlineArrowNarrowUp className="h-4 w-4 text-black" />
                <span className="ml-1 text-sm">{stat.change} from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-fadeIn animation-delay-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {actions.map((action, j) => (
              <Link
                to={action.path}
                key={j}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-[#E1F5FE] hover:border-[#81D4FA] transition-all duration-300 hover:scale-105 flex flex-col items-center"
              >
                <div className="bg-[#E1F5FE] p-3 rounded-lg mb-2 transition-all duration-300 group-hover:bg-[#B3E5FC]">
                  <action.Icon className="h-6 w-6 text-black" />
                </div>
                <span className="font-medium">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>

      {/* Footer */}
        <footer className="mt-8 text-center text-gray-700 text-sm animate-fadeIn">
          <p>© {new Date().getFullYear()} Customer Records System. All rights reserved.</p>
        </footer>
    </div>
  );
}

export default OverView;

// Dashboard.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        onExpand={() => setIsSidebarExpanded(true)}
        onCollapse={() => setIsSidebarExpanded(false)}
      />
      
      {/* Main Content Area */}
      <div 
        className={`flex-grow p-1.5 min-h-screen transition-all duration-300 ${
          isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
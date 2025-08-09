import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaListCheck, FaClipboardList } from "react-icons/fa6";
import { IoGitBranchOutline } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";


import {
  FaBars,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaHome,
  FaHistory,
  FaPlus,
  FaExchangeAlt,
  FaGlobe,
  FaReceipt,
  FaPiggyBank,
  FaSignOutAlt,
} from "react-icons/fa";

const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #2c5282 transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #2c5282;
    border-radius: 20px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #1a365d;
  }
  .scroll-controls {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, #ebf4ff 40%);
    padding: 1rem 0;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    pointer-events: none;
  }
  .scroll-button {
    pointer-events: auto;
    padding: 0.75rem;
    border-radius: 9999px;
    background-color: #2c5282;
    color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scroll-button:hover {
    background-color: #1a365d;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Sidebar = ({ onExpand = () => {}, onCollapse = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollControls, setShowScrollControls] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    closeSidebar();
    console.log("User logged out");
    navigate("/signin");
  };

  const navCategories = [
    {
      header: "Main",
      links: [
        { path: "over-view", label: "OverView", icon: FaHome },
        { path: "customers-list", label: "LOC", icon: FaClipboardList },
        { path: "new-customers", label: "New-Customers", icon: MdOutlineCreateNewFolder },
        { path: "create-record", label: "Add to CR", icon: FaPlus },
        { path: "check-record", label: "Check CR", icon: FaListCheck },
        { path: "branch", label: "Branch", icon: IoGitBranchOutline },



      ],
    },
  ];

  const checkScroll = () => {
    if (sidebarRef.current) {
      const { scrollHeight, clientHeight } = sidebarRef.current;
      setShowScrollControls(scrollHeight > clientHeight);
    }
  };

  const scroll = (direction) => {
    if (sidebarRef.current) {
      const scrollAmount = direction === "up" ? -200 : 200;
      sidebarRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const current = sidebarRef.current;
    current?.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => current?.removeEventListener("scroll", checkScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
  }, [isOpen]);

  const renderLinks = () => (
    <>
      {navCategories.map((category, idx) => (
        <div key={idx} className="mb-6">
          <h6
            className={`text-xs uppercase font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 h-0 mb-0 pb-0 border-0"
            }`}
          >
            {category.header}
          </h6>
          <ul className="space-y-2">
            {category.links.map((link) => {
              const Active = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      Active
                        ? "bg-blue-100 border-l-4 border-blue-700 text-blue-800 font-semibold"
                        : "text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="mr-3 w-6 h-6 flex-shrink-0 flex items-center justify-center"
                    >
                      <link.icon
                        className={`w-full h-full transition-colors ${
                          Active
                            ? "text-blue-700"
                            : "text-gray-900 group-hover:text-blue-700"
                        }`}
                      />
                    </motion.div>
                    <motion.span
                      className="flex-grow"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        x: isExpanded ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed lg:hidden top-4 left-4 z-[1050] bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-800 active:scale-95 transition-all"
      >
        <FaBars className="w-5 h-5 text-gray-100" />
      </button>

      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className="hidden lg:flex lg:flex-col fixed left-0 top-0 w-20 h-screen bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl z-[1040] p-5 overflow-y-auto custom-scrollbar transition-all duration-300 hover:w-64"
        onMouseEnter={() => {
          setIsExpanded(true);
          onExpand();
        }}
        onMouseLeave={() => {
          setIsExpanded(false);
          onCollapse();
        }}
      >
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "h-12 mb-8" : "h-0 mb-0"
          }`}
        >
          <div
            className="bg-[url(./assets/fvl.jpg)]  bg-center bg-contain w-28 h-12 bg-no-repeat"
            aria-label="Logo"
          />
        </div>

        <div className="flex-1">{renderLinks()}</div>

        {showScrollControls && (
          <div className="scroll-controls">
            <button onClick={() => scroll("up")} className="scroll-button" aria-label="Scroll up">
              <motion.div
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="flex items-center justify-center"
              >
                <FaChevronUp className="w-4 h-4 text-white" />
              </motion.div>
            </button>
            <button onClick={() => scroll("down")} className="scroll-button" aria-label="Scroll down">
              <motion.div
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="flex items-center justify-center"
              >
                <FaChevronDown className="w-4 h-4 text-white" />
              </motion.div>
            </button>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 font-medium"
          >
            <motion.div
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="flex items-center justify-center"
            >
              <FaSignOutAlt className="w-6 h-6 text-current" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                x: isExpanded ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-gray-800 z-[1040]"
            />

            <motion.div
              ref={sidebarRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-gradient-to-b from-blue-50 to-white shadow-2xl z-[1050] p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div
                  className="bg-[url(./assets/fvl.jpg)] bg-center bg-contain w-24 h-10 bg-no-repeat"
                  aria-label="Logo"
                />
                <button
                  onClick={closeSidebar}
                  className="text-xl text-blue-700 bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <FaTimes className="text-gray-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">{renderLinks()}</div>

              {showScrollControls && (
                <div className="scroll-controls">
                  <button onClick={() => scroll("up")} className="scroll-button">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="flex items-center justify-center"
                    >
                      <FaChevronUp className="w-4 h-4 text-white" />
                    </motion.div>
                  </button>
                  <button onClick={() => scroll("down")} className="scroll-button">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="flex items-center justify-center"
                    >
                      <FaChevronDown className="w-4 h-4 text-white" />
                    </motion.div>
                  </button>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 font-medium"
                >
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    <FaSignOutAlt className="w-6 h-6 text-current" />
                  </motion.div>
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
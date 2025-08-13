import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './utils/ProtectedRoute';

// Lazy loaded components
const SignIn = lazy(() => import('./components/auth-Component/SignIn'));
const Dashboard = lazy(() => import('./components/dash-component/Dashboard'));
const OverView = lazy(() => import('./pages/OverView'));
const ListOfCustomers = lazy(() => import('./pages/ListOfCustomers'));
const NewCustomers = lazy(() => import('./pages/NewCustomers'));
const AddCustomerRecord = lazy(() => import('./pages/AddCustomerRecord'));
const CheckCustomerRecord = lazy(() => import('./pages/CheckCustomerRecord'));
const Branches = lazy(() => import('./pages/Branches'));

// Fallback loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <motion.div
      className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center"
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: 'easeInOut'
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 animate-ping"></div>
      </div>
    </motion.div>
  </div>
);

// Enhanced Page Not Found Component
const PageNotFound = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15,
            delay: 0.1
          }}
          className="relative"
        >
          <div className="text-9xl font-bold text-gray-800 opacity-10 absolute -top-8 left-1/2 transform -translate-x-1/2">
            404
          </div>
          <div className="mb-10 relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 5, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg 
                className="w-48 h-48 mx-auto text-indigo-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M15 9L9 15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M9 9L15 15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-8 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/"
            className="inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className={`px-8 py-4 rounded-xl font-medium text-lg shadow-lg
                ${isHovered 
                  ? 'bg-indigo-700 text-white' 
                  : 'bg-white text-indigo-600 border-2 border-indigo-600'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center gap-3">
                <svg 
                  className={`w-6 h-6 transition-colors ${isHovered ? 'text-white' : 'text-indigo-600'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Homepage</span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {['over-view', 'customers-list', 'create-record'].map((page, index) => (
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link 
                to={`/fisuny-record/${page}`}
                className="block p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="capitalize text-indigo-600 font-medium">
                  {page.replace('-', ' ')}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-6 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Need help? <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">Contact support</a>
      </motion.div>
    </motion.div>
  );
};

// Wrapper to animate page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Dashboard Layout */}
          <Route element={< ProtectedRoute />}>
            <Route path="/fisuny-record" element={<Dashboard />}>
              <Route index element={<OverView />} />
              <Route path="over-view" element={<OverView />} />
              <Route path="customers-list" element={<ListOfCustomers />} />
              <Route path="new-customers" element={<NewCustomers />} />
              <Route path="create-record" element={<AddCustomerRecord />} />
              <Route path="check-record" element={<CheckCustomerRecord />} />
              <Route path="branch" element={<Branches />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <AnimatedRoutes />
    </Suspense>
  </BrowserRouter>
);

export default App;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function SignIn() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1412&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1470&q=80'
  ];

  // Cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // simulate your async sign-in logic:
    try {
      await new Promise(res => setTimeout(res, 1500));
      console.log('Signed in:', { email, password, rememberMe });
      // redirect or whatever...
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="w-full max-w-6xl bg-white rounded-2xl my-[100px] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Left Column */}
        <motion.div className="flex flex-col" variants={itemVariants}>
          {/* Login Form */}
          <motion.div className="flex-1 p-8 sm:p-12 flex flex-col justify-center" variants={itemVariants}>
            <motion.div className="text-center mb-10" variants={itemVariants}>
              <motion.h1 className="text-3xl font-bold text-gray-800 mb-2" whileHover={{ scale: 1.05 }}>
                FISUNY CUSTOMERS MANAGEMENT
              </motion.h1>
              <motion.p className="text-gray-600" variants={itemVariants}>
                Sign in to access your records
              </motion.p>
            </motion.div>

            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <motion.input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="student@fisuny.edu"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <motion.input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="••••••••"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div className="flex items-center" variants={itemVariants}>
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                variants={itemVariants}
              >
                {loading && <FaSpinner className="animate-spin mr-2" />}
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Welcome Note */}
          <motion.div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 sm:p-10" variants={itemVariants}>
            <motion.h2 className="text-2xl font-bold mb-4" whileHover={{ scale: 1.05 }}>
              Welcome FISUNY! Sign in to access your records.
            </motion.h2>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="hidden lg:block relative bg-gradient-to-br from-blue-400 to-indigo-600"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
        >
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
              />
            </AnimatePresence>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <motion.div className="text-center text-white" initial={{ scale: 0.8 }} animate={{ scale: 1, transition: { duration: 0.8 } }}>
              <div className="bg-[url(src/assets/fvl.jpg)] bg-center bg-cover bg-no-repeat border-2 border-dashed rounded-full w-24 h-24 mx-auto mb-6" />
              <motion.h1 className="text-5xl font-bold mb-4" whileHover={{ scale: 1.1 }}>
                FISUNY VICTORY LTD
              </motion.h1>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SignIn;

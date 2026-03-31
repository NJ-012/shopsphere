import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart as ShoppingCartIcon, Bell, User, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import CartDrawer from './CartDrawer';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { user, setUser } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      // Refresh user data
      fetch('/api/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => {});
    }
  }, [user, setUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    // Close mobile menu on route change
    return () => closeAllMenus();
  }, [location]);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/90 backdrop-blur-md shadow-sm text-gray-800' 
      : 'bg-transparent text-white'
  }`;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className={`font-bold text-2xl bg-gradient-to-r ${
                  isScrolled ? 'from-purple-600 to-pink-600 text-transparent bg-clip-text' : 'from-purple-300 to-pink-300'
                }`}
              >
                ShopSphere
              </motion.button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isScrolled ? 'text-gray-400' : 'text-gray-300'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-full w-80 border-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
                      isScrolled 
                        ? 'bg-white text-gray-900 shadow-md' 
                        : 'bg-white/20 backdrop-blur-sm text-white placeholder-white/80'
                    }`}
                  />
                </form>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user?.role === 'CUSTOMER' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/wishlist')}
                  className="relative p-2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Heart size={24} />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
<ShoppingCartIcon size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </motion.button>

              {user && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={() => {/* Fetch notifications logic */}}
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                        isScrolled ? 'bg-gray-200 text-gray-800' : 'bg-white/20 text-white'
                      }`}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-semibold text-lg">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-1 z-50"
                        >
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            {user.full_name}
                          </div>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { navigate('/profile'); closeAllMenus(); }}>
                            My Profile
                          </button>
                          {user.role === 'CUSTOMER' && (
                            <>
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { navigate('/orders'); closeAllMenus(); }}>
                                My Orders
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { navigate('/my-looks'); closeAllMenus(); }}>
                                My Looks
                              </button>
                            </>
                          )}
                          {user.role === 'VENDOR' && (
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { navigate('/vendor/dashboard'); closeAllMenus(); }}>
                              Vendor Dashboard
                            </button>
                          )}
                          {user.role === 'ADMIN' && (
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { navigate('/admin/dashboard'); closeAllMenus(); }}>
                              Admin Dashboard
                            </button>
                          )}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 text-red-600 border-t"
                            onClick={() => {
                              useAuthStore.getState().logout();
                              navigate('/login');
                              closeAllMenus();
                            }}
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {!user && (
                <div className="hidden md:flex space-x-2">
                  <button 
                    onClick={() => { navigate('/login'); closeAllMenus(); }}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      isScrolled 
                        ? 'bg-white text-gray-800 shadow-md hover:shadow-lg hover:bg-gray-50' 
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { navigate('/register'); closeAllMenus(); }}
                    className={`px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-500 transition-all`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-1 flex flex-col items-center justify-center w-10 h-10"
                onClick={toggleMobileMenu}
              >
                <Menu size={24} className={!isMobileMenuOpen ? 'block' : 'hidden'} />
                <X size={24} className={isMobileMenuOpen ? 'block' : 'hidden'} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </form>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100" onClick={() => { navigate('/shop'); closeAllMenus(); }}>
                  Shop
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100" onClick={() => { navigate('/wishlist'); closeAllMenus(); }}>
                  Wishlist
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsCartOpen(true)}>
                  Cart
                </button>
                {user ? (
                  <>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100" onClick={() => { navigate('/profile'); closeAllMenus(); }}>
                      Profile
                    </button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100" onClick={() => {
                      useAuthStore.getState().logout();
                      navigate('/login');
                    }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold" onClick={() => { navigate('/login'); closeAllMenus(); }}>
                      Login
                    </button>
                    <button className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold" onClick={() => { navigate('/register'); closeAllMenus(); }}>
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Navbar;


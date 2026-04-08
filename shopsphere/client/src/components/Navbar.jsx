import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import CartDrawer from './CartDrawer';

const navLinks = [
  { label: 'Explore', to: '/' },
  { label: 'Catalog', to: '/shop' },
  { label: 'Virtual Studio', to: '/studio' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navShell = isScrolled
    ? 'glass-header'
    : 'bg-transparent';

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-[50] transition-all duration-500 ${navShell}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500"></div>
              Shop<span className="text-indigo-400">Sphere</span>
            </button>

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    window.location.pathname === link.to ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 px-8 lg:flex justify-center">
            <div className="relative w-full max-w-lg group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur-sm opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <label className="relative flex w-full items-center gap-3 rounded-full bg-black/50 border border-white/10 px-5 py-2 backdrop-blur-xl">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search the future of fashion..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                />
              </label>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white hover:text-indigo-300 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute 0 top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    {user.full_name?.[0] || 'U'}
                  </span>
                  <span className="hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl glass-card p-2 shadow-2xl origin-top-right z-50"
                    >
                      <div className="border-b border-white/10 px-3 pb-3 pt-2">
                        <p className="text-sm font-semibold text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="mt-2 space-y-1">
                        <button onClick={() => navigate('/profile')} className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">Profile</button>
                        <button onClick={() => navigate('/orders')} className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">Orders</button>
                        <button onClick={async () => { await logout(); navigate('/login'); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-pink-400 transition hover:bg-pink-500/20">Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-4 md:flex">
                <Link to="/login" className="text-sm font-semibold text-gray-300 transition hover:text-white">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm px-6 py-2">
                  Join Now
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen((current) => !current)} className="rounded-full p-2 text-white md:hidden hover:bg-white/10">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-header border-t border-white/10 overflow-hidden md:hidden"
            >
              <div className="p-6 space-y-4">
                <form onSubmit={handleSearch}>
                  <label className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search..."
                      className="w-full bg-transparent text-sm outline-none text-white placeholder:text-gray-500"
                    />
                  </label>
                </form>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link key={link.to} to={link.to} className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white">{link.label}</Link>
                  ))}
                  {!user && (
                    <div className="pt-4 border-t border-white/10 mt-4 flex flex-col gap-2">
                      <Link to="/login" className="block text-center rounded-xl px-4 py-3 text-sm font-semibold text-white border border-white/20">Log in</Link>
                      <Link to="/register" className="block text-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">Create account</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

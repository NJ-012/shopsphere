import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import api from '../api/axiosConfig';
import SkeletonCard from '../components/SkeletonCard';
import ProductCard from '../components/ProductCard';
import useAuthStore from '../store/authStore';

function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/products/featured')
      .then(res => setFeaturedProducts(res.data || []))
      .catch(err => {
        console.error('Featured products error:', err);
        setFeaturedProducts([]);
      });

    api.get('/products/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => {
        console.error('Categories error:', err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="max-w-4xl text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-8 leading-tight"
            >
              Virtual Try-On
              <br />
              <span className="text-6xl md:text-8xl">Fashion</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Discover your perfect fit with our AI-powered virtual try-on technology.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl"
              >
                Shop Now
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Categories */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { name: 'T-Shirts', icon: '👕', count: '45' },
              { name: 'Jeans', icon: '👖', count: '32' },
              { name: 'Sneakers', icon: '👟', count: '28' },
              { name: 'Hoodies', icon: '🧥', count: '19' },
              { name: 'Dresses', icon: '👗', count: '24' },
              { name: 'Jackets', icon: '🧥', count: '15' }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30" />
                <div className="relative h-full p-8 flex flex-col items-center justify-center text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{category.name}</h3>
                  <p className="text-lg opacity-90 drop-shadow-md">{category.count} products</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Trending Now
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6">
                  <ShoppingCart size={64} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h3>
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl">
                  View All Products
                </button>
              </div>
            ) : (
              featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.prod_id} {...product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;


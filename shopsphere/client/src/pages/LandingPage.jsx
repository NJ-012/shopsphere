import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroModel from '../components/3d/HeroModel';
import { ShoppingBag, Star, Zap, ShieldCheck } from 'lucide-react';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { gridContainerVariants } from '../components/ProductCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      setLoadingProducts(true);

      try {
        const { data } = await api.get('/products/featured');
        setFeaturedProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error('Featured products error:', error);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-20">
        <motion.div 
          className="w-full md:w-1/2 z-10 flex flex-col items-start gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full glass-card text-sm font-medium text-indigo-300 border border-indigo-500/30">
            Welcome to the Future of Shopping
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Elevate Your <br />
            <span className="text-gradient">Experience.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-md">
            Discover premium products with breathtaking interactions. ShopSphere brings the digital world to your doorstep.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex gap-4 mt-4">
            <Link to="/shop" className="btn-primary flex items-center gap-2">
              <ShoppingBag size={20} />
              Start Shopping
            </Link>
            <Link to="/shop" className="px-8 py-3 rounded-full glass-card font-semibold hover:bg-white/10 transition-all text-white flex items-center gap-2">
              <Star size={20} className="text-pink-400" />
              Featured
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-8 mt-12 pt-8 border-t border-white/10 w-full">
            <div>
               <h3 className="text-3xl font-bold">10k+</h3>
               <p className="text-gray-500 text-sm">Products</p>
            </div>
            <div>
               <h3 className="text-3xl font-bold text-gradient">24/7</h3>
               <p className="text-gray-500 text-sm">Support</p>
            </div>
            <div>
               <h3 className="text-3xl font-bold">4.9</h3>
               <p className="text-gray-500 text-sm">Rating</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Hero Model */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full md:w-1/2 h-[50vh] md:h-[80vh] cursor-grab active:cursor-grabbing"
        >
          <HeroModel />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Why ShopSphere?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We redefine e-commerce by blending cutting-edge tech with unparalleled aesthetics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap size={32} className="text-yellow-400" />, title: "Instant Delivery", desc: "Experience lightning fast shipping delivered straight to your door step." },
            { icon: <ShieldCheck size={32} className="text-emerald-400" />, title: "Secure Payments", desc: "Your data is protected by bank-level end-to-end encryption." },
            { icon: <Star size={32} className="text-purple-400" />, title: "Premium Quality", desc: "We source our products from verified world-class vendors." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 md:px-20 relative z-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-indigo-300">Featured picks</p>
            <h2 className="mt-3 text-4xl font-display font-bold">Shop the visual highlights</h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              A quick look at some of the products currently available in the catalog.
            </p>
          </div>
          <Link to="/shop" className="hidden rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex">
            View all products
          </Link>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {loadingProducts ? (
            Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            featuredProducts.map((product) => <ProductCard key={product.prod_id} {...product} />)
          )}
        </motion.div>
      </section>
      
      {/* Footer Banner */}
      <section className="border-t border-white/10 py-20 px-6 md:px-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card max-w-4xl mx-auto p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <h2 className="text-4xl font-display font-bold mb-6">Ready to upgrade?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">Join thousands of others in exploring the ultimate digital shopping mall today.</p>
          <Link to="/register" className="btn-primary">
            Create Free Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

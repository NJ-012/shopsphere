import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useAuthStore from '../../store/authStore';

export default function VendorDashboard() {
  const { vendorProducts, fetchVendorProducts, loading } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorProducts();
  }, [fetchVendorProducts]);

  const stats = [
    { label: 'Active Products', value: vendorProducts.length, icon: <Package className="h-6 w-6 text-indigo-400" /> },
    { label: 'Total Orders', value: '12', icon: <ShoppingCart className="h-6 w-6 text-pink-400" /> },
    { label: 'Revenue', value: 'Rs. 45,200', icon: <TrendingUp className="h-6 w-6 text-emerald-400" /> },
  ];

  return (
    <div className="px-6 pb-24 pt-32 mx-auto max-w-7xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Vendor Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.shop_name || user?.full_name}</p>
        </div>
        <button
          onClick={() => navigate('/vendor/products/new')}
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Products</h2>
          <button onClick={() => navigate('/vendor/products')} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition">View All</button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading products...</td></tr>
              ) : vendorProducts.slice(0, 5).map((product) => (
                <tr key={product.prod_id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                      <span className="font-semibold text-white">{product.prod_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{product.cat_name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">Rs. {product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.stock_qty > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {product.stock_qty} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => navigate(`/vendor/products/edit/${product.prod_id}`)} className="text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {!loading && vendorProducts.length === 0 && (
                 <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found. Start by adding your first product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

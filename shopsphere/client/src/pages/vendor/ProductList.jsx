import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../../store/productStore';

export default function VendorProductList() {
  const { vendorProducts, fetchVendorProducts, deleteProduct, loading } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorProducts();
  }, [fetchVendorProducts]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const { success, error } = await deleteProduct(id);
      if (!success) alert(error);
    }
  };

  return (
    <div className="px-6 pb-24 pt-32 mx-auto max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/vendor/dashboard')} className="p-2 rounded-full hover:bg-white/5 text-gray-400">
           <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">Manage Products</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search your catalog..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <button
          onClick={() => navigate('/vendor/products/new')}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
        >
          <Plus size={20} />
          New Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading catalog...</div>
        ) : vendorProducts.map((product) => (
          <motion.div
            key={product.prod_id}
            layout
            className="glass-card flex items-center gap-6 p-4 border border-white/10 hover:border-white/20 transition-all"
          >
            <img src={product.image_url} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{product.prod_name}</h3>
              <p className="text-sm text-gray-400">{product.cat_name}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-lg font-bold text-indigo-400">Rs. {product.price}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{product.stock_qty} Units</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/vendor/products/edit/${product.prod_id}`)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(product.prod_id, product.prod_name)}
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
        {!loading && vendorProducts.length === 0 && (
          <div className="py-20 text-center glass-card border-dashed border-2 border-white/5">
            <Package size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
            <p className="text-gray-400">Your product list is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../../api/axiosConfig';
import useProductStore from '../../store/productStore';

export default function VendorProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useProductStore();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prod_name: '',
    cat_id: '',
    price: '',
    stock_qty: '',
    description: '',
    image_url: '',
    discount_pct: 0
  });

  useEffect(() => {
    async function init() {
      const { data } = await api.get('/products/categories');
      setCategories(data);

      if (id) {
        setLoading(true);
        try {
          const { data: product } = await api.get(`/products/${id}`);
          setFormData({
            prod_name: product.prod_name,
            cat_id: product.cat_id || '',
            price: product.price,
            stock_qty: product.stock_qty,
            description: product.description,
            image_url: product.image_url,
            discount_pct: product.discount_pct || 0
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    init();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
       ...formData,
       cat_id: Number(formData.cat_id),
       price: Number(formData.price),
       stock_qty: Number(formData.stock_qty),
       discount_pct: Number(formData.discount_pct)
    };

    const result = id ? await updateProduct(id, payload) : await createProduct(payload);

    if (result.success) {
      navigate('/vendor/products');
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  if (loading && id) return <div className="pt-32 text-center text-gray-500">Loading details...</div>;

  return (
    <div className="px-6 pb-24 pt-32 mx-auto max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 font-bold">
           <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-display font-bold text-white">{id ? 'Edit Product' : 'Create Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-8 border border-white/10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product Name</label>
            <input
              required
              value={formData.prod_name}
              onChange={(e) => setFormData({...formData, prod_name: e.target.value})}
              placeholder="e.g. Future Edition Sneakers"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Category</label>
              <select
                required
                value={formData.cat_id}
                onChange={(e) => setFormData({...formData, cat_id: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all appearance-none"
              >
                <option value="" disabled className="bg-slate-900">Select Category</option>
                {categories.map(c => (
                  <option key={c.cat_id} value={c.cat_id} className="bg-slate-900">{c.cat_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Price (Rs.)</label>
              <input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Stock Quantity</label>
              <input
                required
                type="number"
                value={formData.stock_qty}
                onChange={(e) => setFormData({...formData, stock_qty: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Discount %</label>
              <input
                type="number"
                value={formData.discount_pct}
                onChange={(e) => setFormData({...formData, discount_pct: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Image URL</label>
            <div className="relative group">
              <input
                required
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-12 py-3 text-white focus:border-indigo-500/50 outline-none transition-all"
              />
              <Upload className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-indigo-500/50 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="px-8 py-3 rounded-full border border-white/10 text-gray-400 font-semibold hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-10 py-3 disabled:opacity-50"
          >
            <Save size={18} />
            {id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { getProductImageUrl, handleProductImageError } from '../utils/productImage';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToastStore();
  const productImage = getProductImageUrl(product?.image_url);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Product detail error:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product) {
      return 0;
    }
    return product.current_price || Math.round(product.price * (1 - (product.discount_pct || 0) / 100));
  }, [product]);

  if (loading) {
    return <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
        <p className="display-font text-3xl font-bold text-slate-900">Product not found</p>
        <button type="button" onClick={() => navigate('/shop')} className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white">
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-[0_20px_60px_rgba(20,33,61,0.08)]">
            <img
              src={productImage}
              alt={product.prod_name}
              onError={handleProductImageError}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
            />
          </div>

          <div className="glass-panel rounded-[2.5rem] p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-600">{product.cat_name}</p>
            <h1 className="display-font mt-3 text-4xl font-bold text-slate-950">{product.prod_name}</h1>
            <p className="mt-2 text-sm text-slate-500">Sold by {product.shop_name}</p>
            <p className="mt-6 text-base leading-7 text-slate-600">{product.description}</p>

            <div className="mt-8 flex items-end gap-3">
              <p className="text-4xl font-extrabold text-slate-950">Rs. {finalPrice.toLocaleString()}</p>
              {product.discount_pct > 0 && <p className="pb-1 text-lg text-slate-400 line-through">Rs. {product.price.toLocaleString()}</p>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {product.try_on_enabled && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                  <Sparkles className="h-4 w-4" />
                  Virtual try-on ready
                </span>
              )}
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
                {product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Currently unavailable'}
              </span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full bg-white px-2 py-2 shadow-sm">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-10 w-10 rounded-full text-lg">
                  -
                </button>
                <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock_qty || 1, current + 1))} className="h-10 w-10 rounded-full text-lg">
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={product.stock_qty <= 0}
                onClick={() => {
                  for (let count = 0; count < quantity; count += 1) {
                    addItem({
                        prod_id: product.prod_id,
                        prod_name: product.prod_name,
                        price: finalPrice,
                        image_url: productImage,
                        stock_qty: product.stock_qty,
                        vendor_name: product.shop_name,
                      });
                  }
                  toast.success('Added to cart');
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => toast.success('Wishlist support is ready for your next iteration')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-4 text-sm font-bold text-slate-900"
              >
                <Heart className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

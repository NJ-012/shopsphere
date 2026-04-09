import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { getProductImageUrl, handleProductImageError } from '../utils/productImage';

/* ── staggered grid animation variants ── */
export const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const gridItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
};

function ProductCard({
  prod_id,
  prod_name,
  price,
  current_price,
  rating,
  review_count,
  image_url,
  discount_pct = 0,
  shop_name,
  stock_qty = 0,
  is_featured = false,
  try_on_enabled = false,
}) {
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToastStore();
  const navigate = useNavigate();

  const productImage = getProductImageUrl(image_url);
  const finalPrice = current_price || Math.round(price * (1 - discount_pct / 100));
  const outOfStock = stock_qty <= 0;

  return (
    <motion.article
      variants={gridItemVariants}
      className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
    >
      {/* ── Image Area ── */}
      <button
        type="button"
        onClick={() => navigate(`/product/${prod_id}`)}
        className="relative block w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800"
      >
        {/* Product Image with hover zoom */}
        <img
          src={productImage}
          alt={prod_name}
          loading="lazy"
          onError={handleProductImageError}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]"
        />

        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {discount_pct > 0 && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {Math.round(discount_pct)}% Off
            </span>
          )}
          {is_featured && (
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((c) => !c);
            toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist');
          }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-md border border-slate-200 dark:border-white/10 transition-colors hover:bg-white dark:hover:bg-white/20"
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-gray-300'}`} />
        </motion.button>

        {/* Add to cart overlay — appears on hover */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                prod_id,
                prod_name,
                price: finalPrice,
                image_url: productImage,
                stock_qty,
                vendor_name: shop_name,
              });
              toast.success(`${prod_name} added to cart`);
            }}
            className="flex items-center gap-2 rounded-full bg-slate-900 dark:bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl transition hover:scale-105 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </button>

      {/* ── Card Content ── */}
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-accent)]">{shop_name}</p>
        <button
          type="button"
          onClick={() => navigate(`/product/${prod_id}`)}
          className="mt-1 block w-full text-left"
        >
          <h3 className="line-clamp-1 font-display text-base font-bold text-[var(--foreground)] transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
            {prod_name}
          </h3>
        </button>

        <div className="mt-1.5 opacity-80">
          <StarRating rating={rating} count={review_count} size="sm" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-black text-[var(--foreground)] leading-none">
                Rs. {finalPrice.toLocaleString()}
              </p>
              {discount_pct > 0 && (
                <span className="text-xs text-[var(--text-muted)] line-through">
                  Rs. {price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          {try_on_enabled && (
            <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-1 text-[8px] font-black uppercase tracking-tighter text-purple-700 dark:text-purple-300">
              Virtual Try-On
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;

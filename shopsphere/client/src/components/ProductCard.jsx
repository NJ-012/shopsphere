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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* ── Image Area ── */}
      <button
        type="button"
        onClick={() => navigate(`/product/${prod_id}`)}
        className="relative block w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60"
      >
        {/* Product Image with hover zoom */}
        <img
          src={productImage}
          alt={prod_name}
          loading="lazy"
          onError={handleProductImageError}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
        />

        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2" style={{ transform: 'translateZ(20px)' }}>
          {discount_pct > 0 && (
            <span className="rounded-full bg-rose-500/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]">
              {Math.round(discount_pct)}% Off
            </span>
          )}
          {is_featured && (
            <span className="rounded-full bg-indigo-500/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((c) => !c);
            toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist');
          }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white shadow-lg border border-white/10 transition-colors hover:bg-white/20"
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'text-gray-300'}`} />
        </motion.button>

        {/* Add to cart overlay button — appears on hover */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: outOfStock ? 1 : 1.05 }}
            whileTap={{ scale: outOfStock ? 1 : 0.95 }}
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
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Unavailable' : 'Add to cart'}
          </motion.button>
        </div>

        {/* Out of stock */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <span className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              Out of stock
            </span>
          </div>
        )}
      </button>

      {/* ── Card Content ── */}
      <div className="px-4 pb-4 pt-4" style={{ transform: 'translateZ(10px)' }}>
        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">{shop_name}</p>
        <button
          type="button"
          onClick={() => navigate(`/product/${prod_id}`)}
          className="mt-1 block w-full text-left"
        >
          <h3 className="font-display text-lg font-bold text-white truncate group-hover:text-gradient transition-all duration-300">
            {prod_name}
          </h3>
        </button>

        <div className="mt-2 text-indigo-200">
          <StarRating rating={rating} count={review_count} size="sm" />
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-white">
              Rs. {finalPrice.toLocaleString()}
            </p>
            {discount_pct > 0 && (
              <p className="text-sm text-gray-500 line-through">Rs. {price.toLocaleString()}</p>
            )}
          </div>
          {try_on_enabled && (
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">
              <Sparkles className="h-3 w-3" />
              Try On
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;

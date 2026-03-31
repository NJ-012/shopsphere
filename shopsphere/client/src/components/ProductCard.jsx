import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import StarRating from './StarRating';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { useState } from 'react';

function ProductCard({
  prod_id,
  prod_name,
  price,
  rating,
  review_count,
  image_url,
  discount_pct = 0,
  shop_name,
  stock_qty = 999,
  is_featured = false,
  try_on_category,
  transparent_img_url
}) {
  const addItem = useCartStore((state) => state.addItem);
  const toastStore = useToastStore();
  
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountedPrice = price * (1 - discount_pct / 100);
  const isOutOfStock = stock_qty === 0;
  const lowStock = stock_qty > 0 && stock_qty < 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      prod_id,
      prod_name,
      price: discountedPrice,
      image_url,
      stock_qty,
      vendor_name: shop_name,
    });
    toastStore.success(`${prod_name} added to cart!`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toastStore.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleCardClick = () => {
    if (!isOutOfStock) {
      window.location.href = `/product/${prod_id}`;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-50 group-hover:scale-[1.08] transition-transform duration-500">
        <img 
          src={image_url} 
          alt={prod_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        <div className="absolute top-3 left-3 space-y-1 z-10">
          {discount_pct > 0 && (
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{Math.round(discount_pct)}% OFF
            </div>
          )}
          {is_featured && (
            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border hover:bg-white transition-all z-10"
          onClick={toggleWishlist}
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-400'}`} 
          />
        </motion.button>

        {lowStock && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-10">
            Only {stock_qty} left!
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="text-white text-lg font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{shop_name}</p>
        
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {prod_name}
        </h3>

        <div className="mb-3">
          <StarRating rating={rating} count={review_count} size="sm" />
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{Math.round(discountedPrice).toLocaleString()}
          </span>
          {discount_pct > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{Math.round(price).toLocaleString()}
            </span>
          )}
        </div>

        {try_on_category && (
          <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full mb-3 font-medium shadow-lg">
            ✨ Try On
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:from-purple-700 hover:to-pink-500'
          }`}
        >
          {isOutOfStock ? (
            <>
              <div className="w-5 h-5 bg-gray-400 rounded-full animate-pulse" />
              <span>Out of Stock</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;


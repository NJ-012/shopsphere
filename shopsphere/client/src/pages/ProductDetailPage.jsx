import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Share2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import useToastStore from '../store/toastStore';
import useCartStore from '../store/cartStore';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Mock product data for demo (backend not running)
    setTimeout(() => {
      setProduct({
        prod_id: id,
        name: `Premium Product #${id}`,
        description: 'High quality product with modern design and excellent craftsmanship.',
        price: 89.99,
        original_price: 129.99,
        rating: 4.8,
        reviews_count: 127,
        images: [
          `/api/products/${id}/image1.jpg`,
          `/api/products/${id}/image2.jpg`,
          `/api/products/${id}/image3.jpg`
        ],
        variants: [
          { name: 'Small', in_stock: true },
          { name: 'Medium', in_stock: true },
          { name: 'Large', in_stock: false },
          { name: 'XL', in_stock: true }
        ],
        category: 'Featured',
        seller: 'Premium Brand'
      });
      setImages([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=85',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3133?w=800&q=85'
      ]);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.variants[selectedVariant].in_stock) {
      addToCart({
        ...product,
        variant: product.variants[selectedVariant].name,
        quantity,
        image: images[0]
      });
      addToast('Added to cart!', 'success');
    } else {
      addToast('This variant is out of stock', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded-xl w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 opacity-40">
            <Search size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img 
                src={images[0]} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setImages(prev => {
                    const newImages = [...prev];
                    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                    return newImages;
                  })}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                    index === 0 
                      ? 'border-purple-500 shadow-lg scale-105' 
                      : 'border-transparent hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={20}
                      className={`${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews_count} reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.original_price}</span>
                <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  31% OFF
                </span>
              </div>
              <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                In stock ({product.variants.filter(v => v.in_stock).length} variants)
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Select Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.variants.map((variant, index) => (
                  <motion.button
                    key={variant.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVariant(index)}
                    disabled={!variant.in_stock}
                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${
                      selectedVariant === index
                        ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-md'
                        : variant.in_stock
                          ? 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {variant.name}
                    {!variant.in_stock && <span className="text-xs block mt-1">Out of stock</span>}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.variants[selectedVariant].in_stock}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ShoppingCart size={24} className="inline mr-2" />
                Add to Cart
              </motion.button>
              
              <div className="flex gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl py-3 px-6 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <Heart size={20} className="inline mr-2" />
                  Add to Wishlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl py-3 px-6 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <Share2 size={20} className="inline mr-2" />
                  Share
                </motion.button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-lg">
              <h3 className="text-lg font-bold mb-4">About this product</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Seller:</span> {product.seller}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;


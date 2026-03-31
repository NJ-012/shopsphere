import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import SkeletonCard from '../components/SkeletonCard';
import ProductCard from '../components/ProductCard';
import useToastStore from '../store/toastStore';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sort: 'newest'
  });
  const addToast = useToastStore((state) => state.addToast);

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchQuery, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: filters.category,
        price: filters.priceRange,
        sort: filters.sort
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Products fetch error:', error);
      addToast('Failed to load products (backend required)', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Categories fetch error:', error);
      setCategories([
        { id: 1, name: 'T-Shirts', slug: 'tshirts' },
        { id: 2, name: 'Jeans', slug: 'jeans' },
        { id: 3, name: 'Sneakers', slug: 'sneakers' },
        { id: 4, name: 'Hoodies', slug: 'hoodies' }
      ]);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const productsToShow = products.slice(0, 24); // Show max 24 for demo

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
          >
            Shop All Products
          </motion.h1>
          <p className="text-xl text-gray-600">
            {products.length} products {searchQuery && `matching "${searchQuery}"`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={searchQuery}
              onChange={(e) => setSearchParams({ q: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border shadow-sm hover:shadow-md'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border shadow-sm hover:shadow-md'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Filter size={20} />
              Filters
            </h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${filters.category === cat.slug ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Price Range</h4>
              <select 
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200+">$200+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Sort By</h4>
              <select 
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : productsToShow.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 opacity-40">
                    <Search size={64} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
                  <button 
                    onClick={() => setSearchParams({})}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                productsToShow.map((product) => (
                  <ProductCard key={product.prod_id || product.id} {...product} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;


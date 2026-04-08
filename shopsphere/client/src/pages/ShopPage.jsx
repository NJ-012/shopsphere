import { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { gridContainerVariants } from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    async function loadShop() {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products', { params: { category, q: query } }),
          api.get('/products/categories'),
        ]);
        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Shop load error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, [category, query]);

  const activeCategoryName = categories.find((item) => item.cat_slug === category)?.cat_name;

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="glass-panel h-fit rounded-[2rem] p-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-700">Discover</p>
            </div>

            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                const next = new URLSearchParams(searchParams);
                if (searchInput.trim()) {
                  next.set('q', searchInput.trim());
                } else {
                  next.delete('q');
                }
                setSearchParams(next);
              }}
            >
              <label className="flex items-center gap-3 rounded-full bg-white px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </form>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Categories</p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setSearchParams(query ? { q: query } : {})}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    !category ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  All products
                </button>
                {categories.map((item) => (
                  <button
                    key={item.cat_slug}
                    type="button"
                    onClick={() => {
                      const next = {};
                      if (query) {
                        next.q = query;
                      }
                      next.category = item.cat_slug;
                      setSearchParams(next);
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      category === item.cat_slug ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    {item.cat_name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600">Shop</p>
                <h1 className="display-font mt-2 text-4xl font-bold text-slate-950">
                  {activeCategoryName || 'Curated collection'}
                </h1>
                <p className="mt-2 text-slate-600">
                  {products.length} result(s)
                  {query ? ` for "${query}"` : ''}
                </p>
              </div>
            </div>

            <motion.div
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              key={category + query}
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
              ) : products.length ? (
                products.map((product) => <ProductCard key={product.prod_id} {...product} />)
              ) : (
                <div className="col-span-full glass-card p-10 text-center">
                  <p className="font-display text-2xl font-bold text-white">No products found</p>
                  <p className="mt-2 text-gray-400">Try a different search or switch categories.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;

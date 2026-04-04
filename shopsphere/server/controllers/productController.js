import { getStore } from '../data/store.js';

function withComputedPrice(product) {
  const currentPrice = Math.round(product.price * (1 - (product.discount_pct || 0) / 100));
  return {
    ...product,
    current_price: currentPrice
  };
}

export async function getAllProducts(req, res) {
  try {
    const { category, q, featured } = req.query;
    const store = await getStore();
    let products = store.products.map(withComputedPrice);

    if (featured === 'true') {
      products = products.filter((item) => item.is_featured);
    }

    if (category) {
      const normalized = String(category).toLowerCase();
      products = products.filter(
        (item) => item.cat_slug.toLowerCase() === normalized || item.cat_name.toLowerCase() === normalized
      );
    }

    if (q) {
      const query = String(q).trim().toLowerCase();
      products = products.filter(
        (item) => item.prod_name.toLowerCase().includes(query) || item.shop_name.toLowerCase().includes(query)
      );
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
}

export async function getProductById(req, res) {
  try {
    const productId = Number(req.params.id);
    const store = await getStore();
    const product = store.products.find((item) => item.prod_id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(withComputedPrice(product));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
}

export async function getFeaturedProducts(req, res) {
  try {
    const store = await getStore();
    const featured = store.products.filter((item) => item.is_featured).map(withComputedPrice);
    res.json(featured);
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products.' });
  }
}

export async function getCategories(req, res) {
  try {
    const store = await getStore();
    const categories = store.products.reduce((acc, product) => {
      const key = product.cat_slug;
      if (!acc[key]) {
        acc[key] = {
          cat_id: Object.keys(acc).length + 1,
          cat_name: product.cat_name,
          cat_slug: product.cat_slug,
          product_count: 0
        };
      }
      acc[key].product_count += 1;
      return acc;
    }, {});

    res.json(Object.values(categories));
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

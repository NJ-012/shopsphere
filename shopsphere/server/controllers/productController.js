import {
  getAllProducts as mysqlGetAllProducts,
  getCategories as mysqlGetCategories,
  getProductById as mysqlGetProductById,
  isDbAvailable,
} from '../db/queries.js';
import { buildMockProductImage } from '../utils/mockImage.js';

function getProductImage(product) {
  const imageUrl = product.IMAGE_URL || product.image_url;

  // Fall back to a generated placeholder when the database value is empty.
  if (imageUrl && String(imageUrl).trim()) {
    return String(imageUrl).trim();
  }

  return buildMockProductImage(product);
}

function normalizeProduct(product) {
  if (!product) return null;
  const prodId = product.PROD_ID || product.prod_id;
  const prodName = product.PROD_NAME || product.prod_name;
  const price = Number(product.PRICE ?? product.price ?? 0);
  const discountPct = Number(product.DISCOUNT_PCT ?? product.discount_pct ?? 0);

  return {
    prod_id: prodId,
    prod_name: prodName,
    description: product.DESCRIPTION || product.description || `${prodName} from ShopSphere.`,
    price,
    stock_qty: Number(product.STOCK_QTY ?? product.stock_qty ?? 0),
    rating: Number(product.RATING ?? product.rating ?? 4.2),
    review_count: Number(product.REVIEW_COUNT ?? product.review_count ?? 0),
    is_featured: Boolean(product.IS_FEATURED ?? product.is_featured ?? Number(product.RATING ?? 0) >= 4.5),
    shop_name: product.SHOP_NAME || product.shop_name || 'ShopSphere Select',
    cat_name: product.CAT_NAME || product.cat_name || 'Featured',
    cat_slug: product.CAT_SLUG || product.cat_slug || 'featured',
    image_url: getProductImage(product),
    discount_pct: discountPct,
    current_price: Math.round(price * (1 - discountPct / 100)),
    is_active: Boolean(product.IS_ACTIVE ?? product.is_active ?? true),
  };
}

function normalizeCategory(category, index = 0) {
  return {
    cat_id: category.CAT_ID ?? category.cat_id ?? index + 1,
    cat_name: category.CAT_NAME ?? category.cat_name ?? 'Category',
    cat_slug: category.CAT_SLUG ?? category.cat_slug ?? 'category',
    product_count: Number(category.PRODUCT_COUNT ?? category.product_count ?? 0),
  };
}

export async function getAllProducts(req, res) {
  try {
    const { category = '', q: search = '', featured = 'false' } = req.query;
    
    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const products = await mysqlGetAllProducts({
      category,
      search,
      featured: featured === 'true',
      limit: 50,
    });

    const normalized = products.map(normalizeProduct);
    console.log('API GET /products - count:', normalized.length);
    normalized.forEach(p => console.log('Product', p.prod_id, 'image_url:', p.image_url));

    res.json(normalized);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
}

export async function getProductById(req, res) {
  try {
    const productId = Number(req.params.id);
    
    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const product = await mysqlGetProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(normalizeProduct(product));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
}

export async function getFeaturedProducts(_req, res) {
  try {
    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const products = await mysqlGetAllProducts({ featured: true, limit: 8 });

    res.json(products.map(normalizeProduct));
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products.' });
  }
}

export async function getCategories(_req, res) {
  try {
    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const categories = await mysqlGetCategories();

    res.json(categories.map(normalizeCategory));
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

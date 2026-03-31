export async function getFeaturedProducts(req, res) {
  try {
    const mockProducts = [
      {
        prod_id: 1,
        prod_name: 'Premium Cotton T-Shirt',
        price: 799,
        rating: 4.5,
        review_count: 127,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&fit=crop',
        discount_pct: 10,
        shop_name: 'Trendy Wear',
        stock_qty: 50,
        is_featured: true
      },
      {
        prod_id: 2,
        prod_name: 'Slim Fit Jeans',
        price: 1599,
        rating: 4.8,
        review_count: 89,
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop',
        discount_pct: 0,
        shop_name: 'Urban Denim',
        stock_qty: 25,
        is_featured: true
      },
      {
        prod_id: 3,
        prod_name: 'Classic Sneakers',
        price: 1299,
        rating: 4.3,
        review_count: 156,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop',
        discount_pct: 15,
        shop_name: 'Street Style',
        stock_qty: 38,
        is_featured: true
      },
      {
        prod_id: 4,
        prod_name: 'Oversized Hoodie',
        price: 1199,
        rating: 4.7,
        review_count: 203,
        image_url: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&fit=crop',
        discount_pct: 5,
        shop_name: 'Cozy Wear',
        stock_qty: 42,
        is_featured: true
      }
    ];
    
    res.json(mockProducts);
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
}

export async function getCategories(req, res) {
  try {
    const mockCategories = [
      { cat_id: 1, cat_name: 'T-Shirts', product_count: 45 },
      { cat_id: 2, cat_name: 'Jeans', product_count: 32 },
      { cat_id: 3, cat_name: 'Sneakers', product_count: 28 },
      { cat_id: 4, cat_name: 'Hoodies', product_count: 19 },
      { cat_id: 5, cat_name: 'Dresses', product_count: 24 },
      { cat_id: 6, cat_name: 'Jackets', product_count: 15 }
    ];
    
    res.json(mockCategories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}


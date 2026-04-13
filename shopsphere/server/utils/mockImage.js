export function buildMockProductImage(product = {}) {
  const productName = (product.prod_name ?? product.PROD_NAME ?? 'product').toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim();
  const categoryName = (product.cat_name ?? product.CAT_NAME ?? 'shopping').toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim();
  
  // Smart keyword mapping for relevance
  let keywords = `${productName},${categoryName}`;
  
  // Enhance common product terms for better Unsplash matches
  if (productName.includes('shirt') || productName.includes('tshirt') || productName.includes('tee')) {
    keywords = 'shirt,fashion,clothing';
  } else if (productName.includes('laptop')) {
    keywords = 'laptop,electronics,computer';
  } else if (productName.includes('tv') || productName.includes('sony')) {
    keywords = 'television,tv,electronics';
  } else if (productName.includes('coffee') || productName.includes('maker')) {
    keywords = 'coffee,machine,kitchen,appliance';
  } else if (productName.includes('phone') || productName.includes('smartphone') || productName.includes('iphone') || productName.includes('samsung')) {
    keywords = 'smartphone,phone,mobile';
  } else if (productName.includes('jacket') || productName.includes('denim') || productName.includes('hoodie')) {
    keywords = 'jacket,fashion,clothing';
  } else if (productName.includes('earbuds') || productName.includes('headphone') || productName.includes('headphones')) {
    keywords = 'earbuds,headphones,wireless,electronics';
  } else if (productName.includes('keyboard')) {
    keywords = 'keyboard,computer,electronics';
  } else if (productName.includes('monitor')) {
    keywords = 'monitor,computer,display';
  } else if (categoryName.includes('electronics')) {
    keywords = 'electronics,gadget,technology';
  }
  
  // Ultimate fallback
  if (!keywords || keywords.trim() === ',') {
    keywords = 'product,shopping,ecommerce';
  }
  
  // Unsplash dynamic image (always returns image, cache-friendly)
  const imageUrl = `https://source.unsplash.com/featured/500x600/?${keywords}&w=500&h=600`;
  
  return imageUrl;
}

import dotenv from 'dotenv';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

const CONTEXT_MAP = {
  shirt: 'fashion, clothing, shirt',
  tshirt: 'fashion, clothing, tshirt',
  tee: 'fashion, clothing, tshirt',
  laptop: 'laptop, computer, technology',
  computer: 'computer, technology',
  tv: 'television, electronics, tv',
  sony: 'sony, electronics',
  phone: 'smartphone, mobile, electronics',
  smartphone: 'smartphone, mobile',
  coffee: 'coffee, machine, kitchen',
  maker: 'appliance, kitchen',
  jacket: 'jacket, clothing, fashion',
  denim: 'denim, fashion, clothing',
  earbuds: 'headphones, earbuds, electronics',
  headphones: 'headphones, electronics',
  keyboard: 'keyboard, computer',
  monitor: 'monitor, computer, display',
  watch: 'watch, fashion, accessory',
  beauty: 'beauty, cosmetics, skincare',
  jewelry: 'jewelry, luxury, gold',
  appliance: 'home appliance, electronics',
  accessory: 'accessory, fashion',
  shoes: 'shoes, fashion, footwear',
  sneaker: 'sneakers, shoes, fashion'
};

function normalizeQuery(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getContextKeywords(text = '') {
  const normalized = normalizeQuery(text);
  const words = normalized.split(' ');
  const keywords = new Set();
  
  words.forEach(word => {
    if (CONTEXT_MAP[word]) {
      CONTEXT_MAP[word].split(', ').forEach(kw => keywords.add(kw));
    }
  });
  
  return Array.from(keywords);
}

function encodeFallbackQuery(productName = '', category = '') {
  const contextKeywords = getContextKeywords(`${productName} ${category}`);
  const baseNormalized = normalizeQuery(productName);
  const terms = baseNormalized.split(' ').filter(Boolean);
  
  // Return 1-2 most relevant keywords for Unsplash
  const combined = [...new Set([...contextKeywords, ...terms])].slice(0, 2);
  return combined.join(',') || 'product';
}

export function isUsableProductImage(imageUrl) {
  const normalizedImageUrl = String(imageUrl || '').trim();

  if (!normalizedImageUrl) return false;
  if (normalizedImageUrl.startsWith('/images/')) return false;
  if (normalizedImageUrl.startsWith('data:')) return false;
  
  // Basic URL validation
  try {
    const url = new URL(normalizedImageUrl);
    return /^https?:/i.test(url.protocol);
  } catch (_e) {
    return false;
  }
}

export function buildFallbackImageUrl(productName = '', category = '', prodId = '') {
  const query = encodeFallbackQuery(productName, category);
  // Use Unsplash Source API - free, no API key required
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
}

export function buildDeterministicImageUrl(prodId = '') {
  // Use Picsum Photos for deterministic, stable images based on product ID
  const seed = String(prodId).replace(/\D/g, '') || '123';
  return `https://picsum.photos/seed/${seed}/400/400`;
}

export function buildPlaceholderSvg() {
  // Inline SVG placeholder as final fallback
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#f3f4f6"/>
    <circle cx="200" cy="160" r="40" fill="#d1d5db"/>
    <rect x="160" y="220" width="80" height="100" fill="#d1d5db"/>
    <text x="200" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">No Image</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function fetchUnsplashImage(productName, category = '') {
  // If no API key, skip and use Pollinations fallback directly
  if (!UNSPLASH_ACCESS_KEY) return null;
  
  const query = normalizeQuery(productName);
  const searchTerms = getContextKeywords(`${productName} ${category}`).join(' ') || query;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerms)}&page=1&per_page=1&orientation=squarish&content_filter=high`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const firstResult = Array.isArray(payload?.results) ? payload.results[0] : null;
    const imageUrl = firstResult?.urls?.regular || firstResult?.urls?.small || null;

    return isUsableProductImage(imageUrl) ? imageUrl : null;
  } catch (_error) {
    return null;
  }
}

export async function resolveProductImage(product = {}) {
  const prodId = product.PROD_ID || product.prod_id || '';
  const productName = product.prod_name || product.PROD_NAME || '';
  const category = product.cat_name || product.CAT_NAME || '';
  const currentImageUrl = product.image_url || product.IMAGE_URL || '';

  if (isUsableProductImage(currentImageUrl)) {
    return String(currentImageUrl).trim();
  }

  // Primary fallback: Unsplash Source API (free, no API key)
  return buildFallbackImageUrl(productName, category, prodId);
}


import dotenv from 'dotenv';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

function normalizeQuery(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function encodeFallbackQuery(productName = '') {
  const normalized = normalizeQuery(productName);
  const terms = normalized.split(' ').filter(Boolean).slice(0, 6);
  return encodeURIComponent(terms.join(',') || 'product');
}

export function isUsableProductImage(imageUrl) {
  const normalizedImageUrl = String(imageUrl || '').trim();

  if (!normalizedImageUrl) return false;
  if (normalizedImageUrl.startsWith('/images/')) return false;
  if (normalizedImageUrl.startsWith('data:')) return false;

  return /^https?:\/\//i.test(normalizedImageUrl);
}

export function buildFallbackImageUrl(productName = '') {
  return `https://source.unsplash.com/featured/?${encodeFallbackQuery(productName)}`;
}

async function fetchUnsplashImage(productName) {
  const query = normalizeQuery(productName);

  if (!UNSPLASH_ACCESS_KEY || !query) {
    return null;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=1&per_page=1&orientation=squarish&content_filter=high`;

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
  const productName = product.prod_name || product.PROD_NAME || '';
  const currentImageUrl = product.image_url || product.IMAGE_URL || '';

  if (isUsableProductImage(currentImageUrl)) {
    return String(currentImageUrl).trim();
  }

  const remoteImageUrl = await fetchUnsplashImage(productName);
  if (remoteImageUrl) {
    return remoteImageUrl;
  }

  return buildFallbackImageUrl(productName);
}

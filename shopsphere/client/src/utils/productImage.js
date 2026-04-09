const FALLBACK_PRODUCT_IMAGE = '/images/laptop.png';
const ERROR_PRODUCT_IMAGE = '/images/laptop.png';

export function getProductImageUrl(imageUrl) {
  // Use a local fallback if no image is provided.
  if (!imageUrl || !String(imageUrl).trim()) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  // If it's a relative path starting with /, it's a local asset.
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  return String(imageUrl).trim();
}

export function handleProductImageError(event) {
  // If a local asset fails (rare) or a remote one fails, use the local fallback.
  if (event.currentTarget.src.includes(FALLBACK_PRODUCT_IMAGE)) {
    return;
  }

  event.currentTarget.src = ERROR_PRODUCT_IMAGE;
}

export { FALLBACK_PRODUCT_IMAGE, ERROR_PRODUCT_IMAGE };

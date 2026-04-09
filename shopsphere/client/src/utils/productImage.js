const FALLBACK_PRODUCT_IMAGE = 'https://picsum.photos/800/800?fallback';
const ERROR_PRODUCT_IMAGE = 'https://picsum.photos/800/800?error';

export function getProductImageUrl(imageUrl) {
  // Use a local fallback when the API does not provide an image.
  if (!imageUrl || !String(imageUrl).trim()) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  return String(imageUrl).trim();
}

export function handleProductImageError(event) {
  // Prevent broken images from staying visible in the UI.
  if (event.currentTarget.src.endsWith('error')) {
    return;
  }

  event.currentTarget.src = ERROR_PRODUCT_IMAGE;
}

export { FALLBACK_PRODUCT_IMAGE, ERROR_PRODUCT_IMAGE };

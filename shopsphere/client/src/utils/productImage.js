const FALLBACK_PRODUCT_IMAGE = 'https://picsum.photos/seed/fallback/800/800';

export function getProductImageUrl(imageUrl) {
  // Use a local fallback when the API does not provide an image.
  if (!imageUrl || !String(imageUrl).trim()) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  return String(imageUrl).trim();
}

export function handleProductImageError(event) {
  // Prevent broken images from staying visible in the UI.
  if (event.currentTarget.src.endsWith(FALLBACK_PRODUCT_IMAGE)) {
    return;
  }

  event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
}

export { FALLBACK_PRODUCT_IMAGE };

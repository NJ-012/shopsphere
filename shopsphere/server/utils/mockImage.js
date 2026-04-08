function hashString(value = '') {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function paletteFromSeed(seed) {
  const palettes = [
    ['#f97316', '#fb7185', '#7c3aed'],
    ['#0f766e', '#14b8a6', '#99f6e4'],
    ['#1d4ed8', '#38bdf8', '#dbeafe'],
    ['#854d0e', '#facc15', '#fef3c7'],
    ['#be123c', '#fb7185', '#ffe4e6'],
    ['#166534', '#4ade80', '#dcfce7'],
  ];

  return palettes[seed % palettes.length];
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildMockProductImage(product = {}) {
  const productId = product.prod_id ?? product.PROD_ID ?? 0;
  const productName = product.prod_name ?? product.PROD_NAME ?? 'ShopSphere Product';
  const categoryName = product.cat_name ?? product.CAT_NAME ?? 'Featured';
  const shopName = product.shop_name ?? product.SHOP_NAME ?? 'ShopSphere';
  const seed = hashString(`${productId}-${productName}-${categoryName}`);
  const [colorA, colorB, colorC] = paletteFromSeed(seed);
  const initials = productName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SP';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100" role="img" aria-label="${escapeXml(productName)}">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="55%" stop-color="${colorB}" />
          <stop offset="100%" stop-color="${colorC}" />
        </linearGradient>
      </defs>
      <rect width="900" height="1100" rx="44" fill="url(#bg)" />
      <circle cx="170" cy="170" r="120" fill="rgba(255,255,255,0.18)" />
      <circle cx="760" cy="220" r="150" fill="rgba(255,255,255,0.12)" />
      <circle cx="720" cy="920" r="180" fill="rgba(15,23,42,0.12)" />
      <rect x="72" y="72" width="756" height="956" rx="36" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.28)" />
      <text x="96" y="136" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="4">${escapeXml(categoryName.toUpperCase())}</text>
      <text x="96" y="725" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700">${escapeXml(initials)}</text>
      <text x="96" y="820" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">${escapeXml(productName)}</text>
      <text x="96" y="886" fill="rgba(255,255,255,0.9)" font-family="Arial, Helvetica, sans-serif" font-size="30">${escapeXml(shopName)}</text>
      <text x="96" y="950" fill="rgba(255,255,255,0.82)" font-family="Arial, Helvetica, sans-serif" font-size="24">Mock product preview</text>
    </svg>
  `.replace(/\s{2,}/g, ' ').trim();

  return toDataUri(svg);
}

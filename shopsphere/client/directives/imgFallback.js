(function () {
  'use strict';

  angular.module('ShopSphereApp').directive('imgFallback', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        let attempts = 0;
        const maxAttempts = 2; // 1 for Pollinations, 1 for local placeholder
        const localPlaceholder = 'placeholder.png';

        element.on('error', function () {
          attempts++;
          
          if (attempts === 1) {
            // Tier 1: Unsplash Source API
            const productName = attrs.imgFallbackName || 'product';
            const keywords = productName.toLowerCase().split(' ').slice(0, 2).join(',');
            const fallbackUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(keywords)}`;
            
            if (element[0].src !== fallbackUrl) {
              element[0].src = fallbackUrl;
            }
          } else if (attempts === 2) {
            // Tier 2: Inline SVG placeholder (guaranteed to work)
            const productId = attrs.imgFallbackId || '1';
            const colors = [
              { bg: '#f8fafc', item: '#e2e8f0', accent: '#64748b' },
              { bg: '#fefefe', item: '#f1f5f9', accent: '#475569' },
              { bg: '#fafafa', item: '#e5e7eb', accent: '#6b7280' },
              { bg: '#f9fafb', item: '#f3f4f6', accent: '#374151' }
            ];
            const colorIndex = (parseInt(productId) - 1) % colors.length;
            const color = colors[colorIndex];
            
            const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
              <rect width="400" height="400" fill="${color.bg}"/>
              <ellipse cx="200" cy="380" rx="120" ry="15" fill="${color.item}" opacity="0.3"/>
              <rect x="120" y="280" width="160" height="80" rx="8" fill="${color.item}"/>
              <rect x="140" y="180" width="120" height="120" rx="12" fill="${color.item}"/>
              <rect x="160" y="140" width="80" height="50" rx="25" fill="${color.accent}"/>
              <circle cx="180" cy="200" r="8" fill="${color.accent}" opacity="0.6"/>
              <circle cx="220" cy="200" r="8" fill="${color.accent}" opacity="0.6"/>
              <rect x="170" y="230" width="60" height="4" rx="2" fill="${color.accent}" opacity="0.4"/>
              <rect x="170" y="240" width="40" height="4" rx="2" fill="${color.accent}" opacity="0.4"/>
              <text x="200" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${color.accent}">Product ${productId}</text>
            </svg>`;
            const fallbackUrl = 'data:image/svg+xml;base64,' + btoa(svg);
            
            if (element[0].src !== fallbackUrl) {
              element[0].src = fallbackUrl;
            }
          } else {
            // Prevent infinite loop
            element.off('error');
          }
        });
      }
    };
  }]);
})();

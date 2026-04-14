(function () {
  'use strict';

  angular.module('ShopSphereApp').component('productImage', {
    bindings: {
      src: '<',
      alt: '<',
      prodId: '<'
    },
    template: 
      '<div class="product-image-container" ng-class="{\'is-loaded\': !$ctrl.loading, \'has-error\': $ctrl.hasError}">' +
      '  <div ng-if="$ctrl.loading" class="skeleton-loader">' +
      '    <div class="skeleton-shimmer"></div>' +
      '  </div>' +
      '  <img ng-src="{{$ctrl.currentSrc}}" alt="{{$ctrl.alt}}" />' +
      '</div>',
    controller: ['$element', '$timeout', function ($element, $timeout) {
      var $ctrl = this;
      $ctrl.loading = true;
      $ctrl.hasError = false;
      $ctrl.currentSrc = '';
      $ctrl.fallbackIndex = 0;
      
      this.$onInit = function() {
        $ctrl.currentSrc = $ctrl.validatePath($ctrl.src);
      };

      this.$onChanges = function(changes) {
        if (changes.src && !changes.src.isFirstChange()) {
          $ctrl.loading = true;
          $ctrl.hasError = false;
          $ctrl.fallbackIndex = 0;
          $ctrl.currentSrc = $ctrl.validatePath(changes.src.currentValue);
        }
      };

      $ctrl.validatePath = function(path) {
        if (!path || path.trim() === '') return $ctrl.getPlaceholderSvg();
        
        // Ensure path starts with leading slash if it's a local public asset
        if (typeof path === 'string' && !path.startsWith('http') && !path.startsWith('/') && !path.startsWith('./')) {
          return '/' + path;
        }
        return path;
      };

      $ctrl.getDeterministicImageUrl = function() {
        // Use local placeholder image from server
        return 'http://localhost:5000/placeholder.png';
      };

      $ctrl.getPlaceholderSvg = function() {
        // Create a more realistic product image placeholder SVG
        const productId = $ctrl.prodId || '1';
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
          <!-- Product shadow -->
          <ellipse cx="200" cy="380" rx="120" ry="15" fill="${color.item}" opacity="0.3"/>
          <!-- Product base -->
          <rect x="120" y="280" width="160" height="80" rx="8" fill="${color.item}"/>
          <!-- Product main body -->
          <rect x="140" y="180" width="120" height="120" rx="12" fill="${color.item}"/>
          <!-- Product top -->
          <rect x="160" y="140" width="80" height="50" rx="25" fill="${color.accent}"/>
          <!-- Product details -->
          <circle cx="180" cy="200" r="8" fill="${color.accent}" opacity="0.6"/>
          <circle cx="220" cy="200" r="8" fill="${color.accent}" opacity="0.6"/>
          <rect x="170" y="230" width="60" height="4" rx="2" fill="${color.accent}" opacity="0.4"/>
          <rect x="170" y="240" width="40" height="4" rx="2" fill="${color.accent}" opacity="0.4"/>
          <!-- Product label -->
          <text x="200" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${color.accent}">Product ${productId}</text>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
      };

      $ctrl.handleLoad = function () {
        $timeout(function() {
          $ctrl.loading = false;
          $ctrl.hasError = false;
        });
      };

      $ctrl.handleError = function () {
        $ctrl.hasError = true;
        
        // Fallback chain
        if ($ctrl.fallbackIndex === 0) {
          // First fallback: inline SVG placeholder (guaranteed to work)
          $ctrl.fallbackIndex++;
          console.warn(`[IMAGE_ERROR] Primary image failed for product ${$ctrl.prodId}. Using SVG placeholder.`);
          $timeout(function() {
            $ctrl.loading = false;
            $ctrl.currentSrc = $ctrl.getPlaceholderSvg();
          });
          return;
        }
        
        // All fallbacks exhausted, just hide loading
        $timeout(function() {
          $ctrl.loading = false;
        });
      };

      this.$postLink = function() {
        var img = $element.find('img');
        img.on('load', $ctrl.handleLoad);
        img.on('error', $ctrl.handleError);
      };
      
      this.$onDestroy = function() {
        var img = $element.find('img');
        img.off('load', $ctrl.handleLoad);
        img.off('error', $ctrl.handleError);
      };
    }]
  });
})();

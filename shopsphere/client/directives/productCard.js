(function () {
  angular.module('ShopSphereApp').directive('productCard', ['CartService', 'StateService', function (CartService, StateService) {
    return {
      restrict: 'E',
      scope: {
        product: '=',
        compact: '@'
      },
      template:
        '<article class="product-card" ng-mousemove="tilt($event)" ng-mouseleave="resetTilt()">' +
        '  <a class="product-image-link" ng-href="#/product/{{product.prod_id}}">' +
        '    <img ng-src="{{product.image_url || product.image}}" alt="{{product.prod_name}}" class="product-image" ng-onerror="fallbackImage($event)" />' +
        '    <div class="image-overlay"></div>' +
        '    <span class="quick-view-label">Quick View</span>' +
        '    <span ng-if="product.discount_pct" class="badge badge-sale">{{product.discount_pct}}% OFF</span>' +
        '    <span ng-if="product.is_featured" class="badge badge-featured">Featured</span>' +
        '  </a>' +
        '  <div class="product-content">' +
        '    <p class="eyebrow">{{product.cat_name}}</p>' +
        '    <h3><a ng-href="#/product/{{product.prod_id}}">{{product.prod_name}}</a></h3>' +
        '    <star-rating rating="product.rating"></star-rating>' +
        '    <div class="price-row">' +
        '      <strong class="current-price">Rs. {{product.current_price || product.price}}</strong>' +
        '      <span ng-if="product.discount_pct" class="original-price">Rs. {{product.price}}</span>' +
        '    </div>' +
        '    <div class="card-actions">' +
        '      <button class="btn btn-primary btn-glow" type="button" ng-click="add()">🛒 Add to cart</button>' +
        '      <button class="btn btn-ghost" type="button" ng-click="save()">♡ Save</button>' +
        '    </div>' +
        '  </div>' +
        '</article>',
      link: function (scope, element) {
        var card = element[0].querySelector('.product-card');

        scope.tilt = function (e) {
          if (!card) return;
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var cx = rect.width / 2;
          var cy = rect.height / 2;
          var rx = ((y - cy) / cy) * -5;
          var ry = ((x - cx) / cx) * 5;
          card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.02)';
        };

        scope.resetTilt = function () {
          if (!card) return;
          card.style.transform = '';
        };

        scope.fallbackImage = function(event) {
          const img = event.target;
          const altText = img.alt.toLowerCase();
          let keywords = 'product,shopping';
          
          // Contextual keywords based on product name
          if (altText.includes('shirt') || altText.includes('tshirt') || altText.includes('tee')) {
            keywords = 'shirt,clothing,fashion';
          } else if (altText.includes('laptop')) {
            keywords = 'laptop,computer,electronics';
          } else if (altText.includes('tv') || altText.includes('sony')) {
            keywords = 'television,electronics,tv';
          } else if (altText.includes('coffee') || altText.includes('maker')) {
            keywords = 'coffee,machine,kitchen';
          } else if (altText.includes('phone') || altText.includes('smartphone')) {
            keywords = 'smartphone,phone,mobile';
          } else if (altText.includes('jacket') || altText.includes('denim')) {
            keywords = 'jacket,clothing,fashion';
          } else if (altText.includes('earbuds') || altText.includes('headphones')) {
            keywords = 'headphones,earbuds,electronics';
          } else if (altText.includes('keyboard')) {
            keywords = 'keyboard,computer';
          } else if (altText.includes('monitor')) {
            keywords = 'monitor,computer,display';
          }
          
          img.src = `https://source.unsplash.com/featured/500x600/?${keywords}&w=500&h=600`;
          img.onerror = null; // Prevent loop
        };

        scope.add = function () {
          CartService.addItem(scope.product, 1);
          StateService.pushToast('Added to cart', scope.product.prod_name + ' was added to your cart.', 'success');
        };
        
        scope.save = function () {
          var ids = StateService.get('shopsphere_wishlist', []);
          if (ids.indexOf(scope.product.prod_id) === -1) {
            ids.push(scope.product.prod_id);
            StateService.set('shopsphere_wishlist', ids);
            StateService.pushToast('Saved', scope.product.prod_name + ' was saved to wishlist.', 'info');
          }
        };
      }
    };
  }]);
}());

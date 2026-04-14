(function () {
  angular.module('ShopSphereApp').directive('productCard', ['CartService', 'StateService', function (CartService, StateService) {
    return {
      restrict: 'E',
      scope: {
        product: '=',
        compact: '@',
        mode: '@'
      },
      template:
        '<article class="product-card" ng-mousemove="tilt($event)" ng-mouseleave="resetTilt()">' +
        '  <a class="product-image-link" ng-href="#/product/{{product.prod_id}}">' +
        '    <product-image src="product.image_url || product.image" alt="product.prod_name" prod-id="product.prod_id"></product-image>' +
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
        '    <div class="card-actions" ng-if="mode !== \'wishlist\'">' +
        '      <button class="btn btn-primary btn-glow" type="button" ng-click="add()">🛒 Add to cart</button>' +
        '      <button class="btn btn-ghost" type="button" ng-click="save()">♡ Save</button>' +
        '    </div>' +
        '    <div class="card-actions" ng-if="mode === \'wishlist\'">' +
        '      <button class="btn btn-primary" type="button" ng-click="moveToCart()">Move to cart</button>' +
        '      <button class="btn btn-ghost" type="button" ng-click="remove()">Remove</button>' +
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

        scope.moveToCart = function () {
          CartService.addItem(scope.product, 1);
          var ids = StateService.get('shopsphere_wishlist', []).filter(function (id) { return id !== scope.product.prod_id; });
          StateService.set('shopsphere_wishlist', ids);
          StateService.pushToast('Moved to cart', scope.product.prod_name + ' is now in your cart.', 'success');
        };

        scope.remove = function () {
          var ids = StateService.get('shopsphere_wishlist', []).filter(function (id) { return id !== scope.product.prod_id; });
          StateService.set('shopsphere_wishlist', ids);
          StateService.pushToast('Removed', scope.product.prod_name + ' was removed from wishlist.', 'info');
        };
      }
    };
  }]);
}());

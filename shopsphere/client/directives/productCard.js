(function () {
  angular.module('ShopSphereApp').directive('productCard', ['CartService', 'StateService', function (CartService, StateService) {
    return {
      restrict: 'E',
      scope: {
        product: '=',
        compact: '@'
      },
      template:
        '<article class="product-card">' +
        '  <a class="product-image-link" ng-href="#/product/{{product.prod_id}}">' +
        '    <img ng-src="{{product.image_url}}" alt="{{product.prod_name}}" class="product-image" />' +
        '  </a>' +
        '  <div class="product-content">' +
        '    <p class="eyebrow">{{product.cat_name}} | {{product.shop_name}}</p>' +
        '    <h3><a ng-href="#/product/{{product.prod_id}}">{{product.prod_name}}</a></h3>' +
        '    <star-rating rating="product.rating"></star-rating>' +
        '    <div class="price-row">' +
        '      <strong>Rs. {{product.current_price || product.price}}</strong>' +
        '      <span ng-if="product.discount_pct" class="muted">{{product.discount_pct}}% off</span>' +
        '    </div>' +
        '    <div class="card-actions">' +
        '      <button class="btn btn-primary" type="button" ng-click="add()">Add to cart</button>' +
        '      <button class="btn btn-ghost" type="button" ng-click="save()">Wishlist</button>' +
        '    </div>' +
        '  </div>' +
        '</article>',
      link: function (scope) {
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

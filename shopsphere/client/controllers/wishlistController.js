(function () {
  angular.module('ShopSphereApp').controller('WishlistController', ['ProductService', 'CartService', 'StateService', function (ProductService, CartService, StateService) {
    var vm = this;
    vm.products = [];

    function loadWishlist() {
      var ids = StateService.get('shopsphere_wishlist', []);
      ProductService.getCatalog().then(function (products) {
        vm.products = products.filter(function (product) {
          return ids.indexOf(product.prod_id) > -1;
        });
      });
    }

    vm.remove = function (productId) {
      var ids = StateService.get('shopsphere_wishlist', []).filter(function (id) { return id !== productId; });
      StateService.set('shopsphere_wishlist', ids);
      loadWishlist();
    };

    vm.moveToCart = function (product) {
      CartService.addItem(product, 1);
      vm.remove(product.prod_id);
      StateService.pushToast('Moved to cart', product.prod_name + ' is now in your cart.', 'success');
    };

    loadWishlist();
  }]);
}());

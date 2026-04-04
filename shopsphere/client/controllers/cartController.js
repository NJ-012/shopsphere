(function () {
  angular.module('ShopSphereApp').controller('CartController', ['$location', '$scope', 'CartService', 'StateService', function ($location, $scope, CartService, StateService) {
    var vm = this;

    function sync() {
      vm.items = CartService.getItems();
      vm.subtotal = CartService.getSubtotal();
      vm.delivery = vm.subtotal >= 999 ? 0 : 49;
      vm.total = vm.subtotal + vm.delivery;
    }

    vm.updateQuantity = function (item) {
      CartService.updateQuantity(item.prod_id, item.quantity);
      sync();
    };

    vm.remove = function (productId) {
      CartService.removeItem(productId);
      StateService.pushToast('Item removed', 'Your cart has been updated.', 'info');
      sync();
    };

    vm.goToCheckout = function () {
      $location.path('/checkout');
    };

    $scope.$on('cart:updated', sync);
    sync();
  }]);
}());

(function () {
  angular.module('ShopSphereApp').controller('CheckoutController', ['$location', 'AuthService', 'CartService', 'OrderService', 'StateService', function ($location, AuthService, CartService, OrderService, StateService) {
    var vm = this;
    var user = AuthService.getUser();
    vm.processing = false;
    vm.items = CartService.getItems();
    vm.subtotal = CartService.getSubtotal();
    vm.delivery = vm.subtotal >= 999 ? 0 : 49;
    vm.total = vm.subtotal + vm.delivery;
    vm.address = {
      full_name: user && user.full_name || '',
      line1: '221B Fashion Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400001',
      phone: user && user.phone || ''
    };

    vm.placeOrder = function () {
      if (!vm.items.length) {
        vm.error = 'Your cart is empty.';
        return;
      }

      vm.processing = true;
      vm.error = null;

      OrderService.createOrder({
        address: vm.address,
        items: vm.items
      }).then(function (order) {
        CartService.clear();
        StateService.pushToast('Order confirmed', 'Your order has been placed successfully.', 'success');
        $location.path('/orders/' + order.order_id);
      }).catch(function (error) {
        vm.error = error.data && error.data.message ? error.data.message : 'Checkout failed.';
      }).finally(function () {
        vm.processing = false;
      });
    };
  }]);
}());

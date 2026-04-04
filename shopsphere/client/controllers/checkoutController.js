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
      vm.processing = true;
      OrderService.createOrder({
        address: vm.address,
        items: vm.items
      }).then(function (order) {
        return OrderService.createPaymentOrder({ amount: order.final_amount, order_id: order.order_id }).then(function () {
          return OrderService.verifyPayment({ razorpay_payment_id: 'mock_payment_' + Date.now(), order_id: order.order_id });
        }).then(function () {
          CartService.clear();
          StateService.pushToast('Order confirmed', 'Payment succeeded and your order is now confirmed.', 'success');
          $location.path('/orders/' + order.order_id);
        });
      }).catch(function (error) {
        vm.error = error.data && error.data.error ? error.data.error : 'Checkout failed.';
      }).finally(function () {
        vm.processing = false;
      });
    };
  }]);
}());

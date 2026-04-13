(function () {
  angular.module('ShopSphereApp').controller('OrderController', ['$location', '$routeParams', 'OrderService', 'StateService', function ($location, $routeParams, OrderService, StateService) {
    var vm = this;
    vm.orderId = $routeParams.id;
    vm.orders = [];
    vm.order = null;

    vm.cancelOrder = function (orderId) {
      OrderService.cancel(orderId).then(function () {
        StateService.pushToast('Order updated', 'The order has been cancelled successfully.', 'warning');
        return $routeParams.id ? loadOrder() : loadOrders();
      });
    };

    function loadOrders() {
      return OrderService.getOrders().then(function (orders) {
        vm.orders = orders;
      });
    }

    function loadOrder() {
      return OrderService.getById(vm.orderId).then(function (order) {
        vm.order = order;
      });
    }

    if (vm.orderId) {
      loadOrder();
    } else {
      loadOrders();
    }
  }]);
}());

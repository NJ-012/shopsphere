(function () {
  angular.module('ShopSphereApp').controller('OrderController', ['$location', '$routeParams', 'OrderService', 'StateService', function ($location, $routeParams, OrderService, StateService) {
    var vm = this;
    vm.orderId = $routeParams.id;
    vm.orders = [];
    vm.order = null;

    vm.cancelOrder = function (orderId) {
      OrderService.cancel(orderId).then(function (order) {
        vm.order = order;
        StateService.pushToast('Order updated', 'The order has been cancelled successfully.', 'warning');
        if (!$routeParams.id) {
          loadOrders();
        }
      });
    };

    function loadOrders() {
      OrderService.getOrders().then(function (orders) {
        vm.orders = orders;
      });
    }

    function loadOrder() {
      OrderService.getById(vm.orderId).then(function (order) {
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

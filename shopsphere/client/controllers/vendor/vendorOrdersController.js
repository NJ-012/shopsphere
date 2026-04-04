(function () {
  angular.module('ShopSphereApp').controller('VendorOrdersController', ['AuthService', 'OrderService', function (AuthService, OrderService) {
    var vm = this;
    var user = AuthService.getUser();
    vm.rows = [];

    OrderService.getOrders().then(function (orders) {
      vm.rows = orders.reduce(function (acc, order) {
        order.items.forEach(function (item) {
          if (item.shop_name === user.shop_name || user.shop_name === 'Urban Denim') {
            acc.push({
              order_id: order.order_id,
              created_at: order.created_at,
              status: order.status,
              product: item.prod_name,
              quantity: item.quantity,
              amount: item.quantity * item.unit_price
            });
          }
        });
        return acc;
      }, []);
    });
  }]);
}());

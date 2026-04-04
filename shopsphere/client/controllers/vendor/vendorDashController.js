(function () {
  angular.module('ShopSphereApp').controller('VendorDashController', ['AuthService', 'ProductService', 'OrderService', function (AuthService, ProductService, OrderService) {
    var vm = this;
    vm.user = AuthService.getUser();
    vm.products = [];
    vm.orders = [];

    ProductService.getCatalog().then(function (products) {
      vm.products = products.filter(function (product) { return product.shop_name === vm.user.shop_name; });
    });

    OrderService.getOrders().then(function (orders) {
      vm.orders = orders;
      vm.metrics = {
        stockUnits: vm.products.reduce(function (sum, product) { return sum + product.stock_qty; }, 0),
        featuredCount: vm.products.filter(function (product) { return product.is_featured; }).length,
        ordersCount: orders.length
      };
    });
  }]);
}());

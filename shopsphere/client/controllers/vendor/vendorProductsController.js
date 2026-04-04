(function () {
  angular.module('ShopSphereApp').controller('VendorProductsController', ['AuthService', 'ProductService', function (AuthService, ProductService) {
    var vm = this;
    var user = AuthService.getUser();
    ProductService.getCatalog().then(function (products) {
      vm.products = products.filter(function (product) { return product.shop_name === user.shop_name; });
    });
  }]);
}());

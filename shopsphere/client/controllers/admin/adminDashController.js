(function () {
  angular.module('ShopSphereApp').controller('AdminDashController', ['$http', 'ProductService', function ($http, ProductService) {
    var vm = this;
    vm.status = {};
    vm.categories = [];

    $http.get('/api/status').then(function (response) {
      vm.status = response.data;
    });

    ProductService.getCategories().then(function (categories) {
      vm.categories = categories;
    });
  }]);
}());

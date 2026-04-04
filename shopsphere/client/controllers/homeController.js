(function () {
  angular.module('ShopSphereApp').controller('HomeController', ['$q', 'ProductService', function ($q, ProductService) {
    var vm = this;
    vm.loading = true;
    vm.featuredProducts = [];
    vm.categories = [];
    vm.heroStats = [
      { label: 'Curated products', value: '08+' },
      { label: 'Account roles', value: '03' },
      { label: 'SPA routes', value: '15' }
    ];

    $q.all([ProductService.getFeatured(), ProductService.getCategories()]).then(function (results) {
      vm.featuredProducts = results[0];
      vm.categories = results[1];
    }).finally(function () {
      vm.loading = false;
    });
  }]);
}());

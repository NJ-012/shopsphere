(function () {
  angular.module('ShopSphereApp').controller('ShopController', ['$location', 'ProductService', function ($location, ProductService) {
    var vm = this;
    vm.loading = true;
    vm.filters = {
      q: $location.search().q || '',
      category: $location.search().category || '',
      featured: $location.search().featured || ''
    };
    vm.sortKey = 'prod_name';
    vm.products = [];
    vm.categories = [];

    vm.applyFilters = function () {
      $location.search({
        q: vm.filters.q || null,
        category: vm.filters.category || null,
        featured: vm.filters.featured || null
      });
      loadProducts();
    };

    function loadProducts() {
      vm.loading = true;
      ProductService.getCatalog(vm.filters).then(function (products) {
        vm.products = products;
      }).finally(function () {
        vm.loading = false;
      });
    }

    ProductService.getCategories().then(function (categories) {
      vm.categories = categories;
    });
    loadProducts();
  }]);
}());

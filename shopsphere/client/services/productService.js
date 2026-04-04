(function () {
  angular.module('ShopSphereApp').service('ProductService', ['$http', function ($http) {
    var service = this;

    service.getCatalog = function (params) {
      return $http.get('/api/products', { params: params || {} }).then(function (response) {
        return response.data;
      });
    };

    service.getFeatured = function () {
      return $http.get('/api/products/featured').then(function (response) {
        return response.data;
      });
    };

    service.getCategories = function () {
      return $http.get('/api/products/categories').then(function (response) {
        return response.data;
      });
    };

    service.getById = function (productId) {
      return $http.get('/api/products/' + productId).then(function (response) {
        return response.data;
      });
    };
  }]);
}());

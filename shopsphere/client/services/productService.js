(function () {
  angular.module('ShopSphereApp').service('ProductService', ['$http', function ($http) {
    var service = this;
    var apiBase = 'http://localhost:5000/api';

    service.getCatalog = function (params) {
      return $http.get(apiBase + '/products', { params: params || {} }).then(function (response) {
        return response.data.data || [];
      });
    };

    service.getFeatured = function () {
      return $http.get(apiBase + '/products/featured').then(function (response) {
        return response.data.data || [];
      });
    };

    service.getCategories = function () {
      return $http.get(apiBase + '/products/categories').then(function (response) {
        return response.data.data || [];
      });
    };

    service.getById = function (productId) {
      return $http.get(apiBase + '/products/' + productId).then(function (response) {
        return response.data.data;
      });
    };
  }]);
}());

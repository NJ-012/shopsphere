(function () {
  angular.module('ShopSphereApp').service('OrderService', ['$http', function ($http) {
    var service = this;
    var apiBase = 'http://localhost:5000/api';

    service.createOrder = function (payload) {
      return $http.post(apiBase + '/orders', payload).then(function (response) {
        return response.data.data;
      });
    };

    service.getOrders = function () {
      return $http.get(apiBase + '/orders').then(function (response) {
        return response.data.data || [];
      });
    };

    service.getById = function (orderId) {
      return $http.get(apiBase + '/orders/' + orderId).then(function (response) {
        return response.data.data;
      });
    };

    service.cancel = function (orderId) {
      return $http.put(apiBase + '/orders/' + orderId + '/cancel').then(function (response) {
        return response.data.data;
      });
    };
  }]);
}());

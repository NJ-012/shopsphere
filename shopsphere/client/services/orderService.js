(function () {
  angular.module('ShopSphereApp').service('OrderService', ['$http', function ($http) {
    var service = this;

    service.createOrder = function (payload) {
      return $http.post('/api/orders', payload).then(function (response) {
        return response.data;
      });
    };

    service.getOrders = function () {
      return $http.get('/api/orders').then(function (response) {
        return response.data;
      });
    };

    service.getById = function (orderId) {
      return $http.get('/api/orders/' + orderId).then(function (response) {
        return response.data;
      });
    };

    service.cancel = function (orderId) {
      return $http.put('/api/orders/' + orderId + '/cancel').then(function (response) {
        return response.data;
      });
    };

    service.createPaymentOrder = function (payload) {
      return $http.post('/api/payment/create-order', payload).then(function (response) {
        return response.data;
      });
    };

    service.verifyPayment = function (payload) {
      return $http.post('/api/payment/verify', payload).then(function (response) {
        return response.data;
      });
    };
  }]);
}());

(function () {
  angular.module('ShopSphereApp').controller('AppController', ['$http', '$scope', 'AuthService', 'StateService', function ($http, $scope, AuthService, StateService) {
    var vm = this;
    vm.toasts = StateService.getToasts();
    vm.systemStatus = { mode: 'loading', oracleConnected: false };

    vm.dismissToast = function (toastId) {
      StateService.dismissToast(toastId);
    };

    function refreshToasts() {
      vm.toasts = StateService.getToasts();
    }

    function loadStatus() {
      $http.get('/api/status').then(function (response) {
        vm.systemStatus = response.data;
      }).catch(function () {
        vm.systemStatus = { mode: 'offline', oracleConnected: false };
      });
    }

    $scope.$on('toast:updated', refreshToasts);
    AuthService.sync().finally(loadStatus);
  }]);
}());

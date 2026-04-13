(function () {
  angular.module('ShopSphereApp').controller('AppController', ['$http', '$scope', 'AuthService', 'StateService', function ($http, $scope, AuthService, StateService) {
    var vm = this;
    vm.toasts = StateService.getToasts();
    vm.systemStatus = { mode: 'loading', dbConnected: false };
    var apiBase = 'http://localhost:5000/api';

    vm.dismissToast = function (toastId) {
      StateService.dismissToast(toastId);
    };

    function refreshToasts() {
      vm.toasts = StateService.getToasts();
    }

    function loadStatus() {
      $http.get(apiBase + '/status').then(function (response) {
        vm.systemStatus = response.data.data;
      }).catch(function () {
        vm.systemStatus = { mode: 'offline', dbConnected: false };
      });
    }

    $scope.$on('toast:updated', refreshToasts);
    AuthService.sync().finally(loadStatus);
  }]);
}());

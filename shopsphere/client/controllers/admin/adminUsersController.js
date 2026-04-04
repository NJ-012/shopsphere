(function () {
  angular.module('ShopSphereApp').controller('AdminUsersController', ['StateService', function (StateService) {
    var vm = this;
    vm.users = [
      { role: 'CUSTOMER', active: 124, suspended: 2, new_today: 7 },
      { role: 'VENDOR', active: 18, suspended: 1, new_today: 1 },
      { role: 'ADMIN', active: 3, suspended: 0, new_today: 0 }
    ];

    vm.notify = function (role) {
      StateService.pushToast('Notification sent', 'A governance update was prepared for ' + role + ' users.', 'info');
    };
  }]);
}());

(function () {
  angular.module('ShopSphereApp').controller('ProfileController', ['AuthService', 'OrderService', 'StateService', function (AuthService, OrderService, StateService) {
    var vm = this;
    vm.user = angular.copy(AuthService.getUser());
    vm.stats = [];

    vm.saveProfile = function () {
      AuthService.updateLocalProfile(vm.user);
      StateService.pushToast('Profile saved', 'Your local profile details were updated.', 'success');
    };

    OrderService.getOrders().then(function (orders) {
      vm.stats = [
        { label: 'Orders placed', value: orders.length },
        { label: 'Completed value', value: 'Rs. ' + orders.reduce(function (sum, order) { return sum + order.final_amount; }, 0) },
        { label: 'Account role', value: vm.user.role }
      ];
    });
  }]);
}());

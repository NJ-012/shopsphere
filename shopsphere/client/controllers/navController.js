(function () {
  angular.module('ShopSphereApp').controller('NavController', ['$location', '$scope', 'AuthService', 'CartService', 'StateService', function ($location, $scope, AuthService, CartService, StateService) {
    var vm = this;
    vm.menuOpen = false;
    vm.user = AuthService.getUser();
    vm.cartCount = CartService.getCount();

    vm.toggleMenu = function () {
      vm.menuOpen = !vm.menuOpen;
    };

    vm.isActive = function (path) {
      return $location.path() === path;
    };

    vm.logout = function () {
      AuthService.logout().then(function () {
        vm.user = null;
        StateService.pushToast('Signed out', 'You have been logged out safely.', 'info');
        $location.path('/');
      });
    };

    $scope.$on('auth:changed', function (_event, user) {
      vm.user = user;
    });

    $scope.$on('cart:updated', function () {
      vm.cartCount = CartService.getCount();
    });
  }]);
}());

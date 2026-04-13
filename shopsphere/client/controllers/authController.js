(function () {
  angular.module('ShopSphereApp').controller('AuthController', ['$location', '$scope', 'AuthService', 'StateService', function ($location, $scope, AuthService, StateService) {
    var vm = this;
    vm.isRegister = $location.path() === '/register';
    vm.loading = false;
    vm.form = {
      full_name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      phone: '',
      shop_name: ''
    };

    vm.submit = function () {
      vm.loading = true;
      vm.error = '';

      var action = vm.isRegister ? AuthService.register(vm.form) : AuthService.login({
        email: vm.form.email,
        password: vm.form.password
      });

      action.then(function () {
        StateService.pushToast(vm.isRegister ? 'Account created' : 'Welcome back', vm.isRegister ? 'Sign in with your new credentials to continue.' : 'Login completed successfully.', 'success');
        $location.path(vm.isRegister ? '/login' : '/');
      }).catch(function (error) {
        vm.error = error.data && error.data.message ? error.data.message : 'Authentication failed.';
      }).finally(function () {
        vm.loading = false;
      });
    };
  }]);
}());

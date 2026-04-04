(function () {
  angular.module('ShopSphereApp').controller('SavedLooksController', ['StudioService', function (StudioService) {
    var vm = this;
    vm.looks = StudioService.getSavedLooks();

    vm.remove = function (lookId) {
      vm.looks = StudioService.deleteLook(lookId);
    };
  }]);
}());

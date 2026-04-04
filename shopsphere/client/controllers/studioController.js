(function () {
  angular.module('ShopSphereApp').controller('StudioController', ['ProductService', 'StudioService', 'StateService', function (ProductService, StudioService, StateService) {
    var vm = this;
    vm.draft = StudioService.getDraft();
    vm.catalog = [];

    vm.addToLook = function (product) {
      if (!vm.draft.items.find(function (item) { return item.prod_id === product.prod_id; })) {
        vm.draft.items.push(product);
        StudioService.saveDraft(vm.draft);
      }
    };

    vm.removeFromLook = function (productId) {
      vm.draft.items = vm.draft.items.filter(function (item) { return item.prod_id !== productId; });
      StudioService.saveDraft(vm.draft);
    };

    vm.saveLook = function () {
      StudioService.saveLook(vm.draft);
      StateService.pushToast('Look saved', 'Your styling board was saved successfully.', 'success');
    };

    ProductService.getCatalog().then(function (products) {
      vm.catalog = products.filter(function (product) { return product.try_on_enabled; });
    });
  }]);
}());

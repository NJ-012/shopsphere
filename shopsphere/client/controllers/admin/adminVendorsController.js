(function () {
  angular.module('ShopSphereApp').controller('AdminVendorsController', ['StateService', function (StateService) {
    var vm = this;
    vm.vendors = [
      { name: 'Urban Denim', owner: 'Aarav Merchant', status: 'Approved', onboarding: 'Catalog ready', score: 92 },
      { name: 'Blossom Lane', owner: 'Mira Kapoor', status: 'Pending', onboarding: 'Waiting KYC', score: 68 },
      { name: 'Lustre Studio', owner: 'Reema Jain', status: 'Approved', onboarding: 'Campaign live', score: 88 }
    ];

    vm.approve = function (vendor) {
      vendor.status = 'Approved';
      vendor.onboarding = 'Approved by admin';
      StateService.pushToast('Vendor approved', vendor.name + ' can now operate fully.', 'success');
    };
  }]);
}());

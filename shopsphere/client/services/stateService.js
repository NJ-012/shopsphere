(function () {
  angular.module('ShopSphereApp').service('StateService', ['$window', '$timeout', '$rootScope', function ($window, $timeout, $rootScope) {
    var storage = $window.localStorage;
    var toastTimerMap = {};
    var service = this;

    service.get = function (key, fallback) {
      try {
        var raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : angular.copy(fallback);
      } catch (_error) {
        return angular.copy(fallback);
      }
    };

    service.set = function (key, value) {
      storage.setItem(key, angular.toJson(value));
      return value;
    };

    service.remove = function (key) {
      storage.removeItem(key);
    };

    service.getToasts = function () {
      return service.get('shopsphere_toasts', []);
    };

    service.pushToast = function (title, message, type) {
      var toasts = service.getToasts();
      var toast = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: title || 'Notice',
        message: message || '',
        type: type || 'info'
      };

      toasts.unshift(toast);
      service.set('shopsphere_toasts', toasts.slice(0, 4));
      $rootScope.$broadcast('toast:updated');

      toastTimerMap[toast.id] = $timeout(function () {
        service.dismissToast(toast.id);
      }, 3500);
    };

    service.dismissToast = function (toastId) {
      var toasts = service.getToasts().filter(function (toast) {
        return toast.id !== toastId;
      });
      service.set('shopsphere_toasts', toasts);
      $rootScope.$broadcast('toast:updated');
      if (toastTimerMap[toastId]) {
        $timeout.cancel(toastTimerMap[toastId]);
        delete toastTimerMap[toastId];
      }
    };
  }]);
}());

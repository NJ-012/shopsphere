(function () {
  angular.module('ShopSphereApp').service('AuthService', ['$http', '$q', '$rootScope', 'StateService', function ($http, $q, $rootScope, StateService) {
    var service = this;
    var user = StateService.get('shopsphere_user', null);

    function setUser(nextUser) {
      user = nextUser;
      if (nextUser) {
        StateService.set('shopsphere_user', nextUser);
      } else {
        StateService.remove('shopsphere_user');
      }
      $rootScope.$broadcast('auth:changed', user);
      return user;
    }

    service.getUser = function () {
      return user;
    };

    service.isAuthenticated = function () {
      return !!user;
    };

    service.login = function (payload) {
      return $http.post('/api/auth/login', payload).then(function (response) {
        return setUser(response.data.user);
      });
    };

    service.register = function (payload) {
      return $http.post('/api/auth/register', payload).then(function (response) {
        return response.data.user;
      });
    };

    service.logout = function () {
      return $http.post('/api/auth/logout').finally(function () {
        setUser(null);
      });
    };

    service.sync = function () {
      return $http.get('/api/auth/me').then(function (response) {
        return setUser(response.data.user);
      }).catch(function () {
        setUser(null);
        return $q.resolve(null);
      });
    };

    service.updateLocalProfile = function (patch) {
      if (!user) {
        return null;
      }
      return setUser(angular.extend({}, user, patch));
    };
  }]);
}());

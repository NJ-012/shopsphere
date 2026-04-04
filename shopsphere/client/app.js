(function () {
  function requireAuthFactory(AuthService, $q, $location) {
    if (!AuthService.isAuthenticated()) {
      $location.path('/login');
      return $q.reject('Authentication required');
    }
    return true;
  }

  function requireRoleFactory(role) {
    return ['AuthService', '$q', '$location', function (AuthService, $q, $location) {
      var user = AuthService.getUser();
      if (!user || user.role !== role) {
        $location.path('/login');
        return $q.reject('Role access denied');
      }
      return true;
    }];
  }

  angular
    .module('ShopSphereApp', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
      $locationProvider.hashPrefix('');
      $httpProvider.defaults.withCredentials = true;

      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          controllerAs: 'vm',
          title: 'Home'
        })
        .when('/shop', {
          templateUrl: 'views/shop.html',
          controller: 'ShopController',
          controllerAs: 'vm',
          title: 'Shop'
        })
        .when('/product/:id', {
          templateUrl: 'views/product-detail.html',
          controller: 'ProductController',
          controllerAs: 'vm',
          title: 'Product Details'
        })
        .when('/cart', {
          templateUrl: 'views/cart.html',
          controller: 'CartController',
          controllerAs: 'vm',
          title: 'Cart'
        })
        .when('/checkout', {
          templateUrl: 'views/checkout.html',
          controller: 'CheckoutController',
          controllerAs: 'vm',
          title: 'Checkout',
          resolve: {
            auth: ['AuthService', '$q', '$location', requireAuthFactory]
          }
        })
        .when('/orders', {
          templateUrl: 'views/orders.html',
          controller: 'OrderController',
          controllerAs: 'vm',
          title: 'Orders',
          resolve: {
            auth: ['AuthService', '$q', '$location', requireAuthFactory]
          }
        })
        .when('/orders/:id', {
          templateUrl: 'views/order-detail.html',
          controller: 'OrderController',
          controllerAs: 'vm',
          title: 'Order Detail',
          resolve: {
            auth: ['AuthService', '$q', '$location', requireAuthFactory]
          }
        })
        .when('/wishlist', {
          templateUrl: 'views/wishlist.html',
          controller: 'WishlistController',
          controllerAs: 'vm',
          title: 'Wishlist'
        })
        .when('/profile', {
          templateUrl: 'views/profile.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          title: 'Profile',
          resolve: {
            auth: ['AuthService', '$q', '$location', requireAuthFactory]
          }
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'AuthController',
          controllerAs: 'vm',
          title: 'Sign In'
        })
        .when('/register', {
          templateUrl: 'views/register.html',
          controller: 'AuthController',
          controllerAs: 'vm',
          title: 'Create Account'
        })
        .when('/studio', {
          templateUrl: 'views/studio.html',
          controller: 'StudioController',
          controllerAs: 'vm',
          title: 'Virtual Studio'
        })
        .when('/saved-looks', {
          templateUrl: 'views/saved-looks.html',
          controller: 'SavedLooksController',
          controllerAs: 'vm',
          title: 'Saved Looks'
        })
        .when('/vendor/dashboard', {
          templateUrl: 'views/vendor/dashboard.html',
          controller: 'VendorDashController',
          controllerAs: 'vm',
          title: 'Vendor Dashboard',
          resolve: {
            vendor: requireRoleFactory('VENDOR')
          }
        })
        .when('/vendor/products', {
          templateUrl: 'views/vendor/products.html',
          controller: 'VendorProductsController',
          controllerAs: 'vm',
          title: 'Vendor Products',
          resolve: {
            vendor: requireRoleFactory('VENDOR')
          }
        })
        .when('/vendor/orders', {
          templateUrl: 'views/vendor/orders.html',
          controller: 'VendorOrdersController',
          controllerAs: 'vm',
          title: 'Vendor Orders',
          resolve: {
            vendor: requireRoleFactory('VENDOR')
          }
        })
        .when('/admin/dashboard', {
          templateUrl: 'views/admin/dashboard.html',
          controller: 'AdminDashController',
          controllerAs: 'vm',
          title: 'Admin Dashboard',
          resolve: {
            admin: requireRoleFactory('ADMIN')
          }
        })
        .when('/admin/vendors', {
          templateUrl: 'views/admin/vendors.html',
          controller: 'AdminVendorsController',
          controllerAs: 'vm',
          title: 'Vendor Management',
          resolve: {
            admin: requireRoleFactory('ADMIN')
          }
        })
        .when('/admin/users', {
          templateUrl: 'views/admin/users.html',
          controller: 'AdminUsersController',
          controllerAs: 'vm',
          title: 'User Management',
          resolve: {
            admin: requireRoleFactory('ADMIN')
          }
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
    .run(['$rootScope', '$window', function ($rootScope, $window) {
      $rootScope.$on('$routeChangeSuccess', function (_event, current) {
        $window.scrollTo(0, 0);
        $window.document.title = 'ShopSphere | ' + (current.$$route && current.$$route.title ? current.$$route.title : 'Storefront');
      });
    }]);
}());

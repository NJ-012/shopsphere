(function () {
  angular.module('ShopSphereApp').service('CartService', ['$rootScope', 'StateService', function ($rootScope, StateService) {
    var KEY = 'shopsphere_cart';
    var service = this;

    function read() {
      return StateService.get(KEY, []);
    }

    function write(items) {
      StateService.set(KEY, items);
      $rootScope.$broadcast('cart:updated', items);
      return items;
    }

    service.getItems = read;

    service.addItem = function (product, quantity) {
      var items = read();
      var existing = items.find(function (item) { return item.prod_id === product.prod_id; });
      var qty = Number(quantity) || 1;

      if (existing) {
        existing.quantity += qty;
      } else {
        items.push({
          prod_id: product.prod_id,
          prod_name: product.prod_name,
          image_url: product.image_url,
          unit_price: product.current_price || product.price,
          quantity: qty,
          shop_name: product.shop_name
        });
      }

      return write(items);
    };

    service.updateQuantity = function (productId, quantity) {
      var items = read().map(function (item) {
        if (item.prod_id === productId) {
          item.quantity = Math.max(1, Number(quantity) || 1);
        }
        return item;
      });
      return write(items);
    };

    service.removeItem = function (productId) {
      return write(read().filter(function (item) { return item.prod_id !== productId; }));
    };

    service.clear = function () {
      return write([]);
    };

    service.getCount = function () {
      return read().reduce(function (sum, item) { return sum + item.quantity; }, 0);
    };

    service.getSubtotal = function () {
      return read().reduce(function (sum, item) { return sum + item.quantity * item.unit_price; }, 0);
    };
  }]);
}());

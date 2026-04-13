(function () {
  angular.module('ShopSphereApp').controller('ProductController', ['$routeParams', 'ProductService', 'CartService', 'StateService', function ($routeParams, ProductService, CartService, StateService) {
    var vm = this;
    vm.quantity = 1;
    vm.product = null;
    vm.relatedProducts = [];
    vm.wishlistIds = StateService.get('shopsphere_wishlist', []);

    vm.fallbackDetailImage = function(img) {
      const altText = img.alt.toLowerCase();
      let keywords = 'product';
      
      if (altText.includes('shirt') || altText.includes('tshirt')) keywords = 'shirt';
      else if (altText.includes('laptop')) keywords = 'laptop';
      else if (altText.includes('tv')) keywords = 'television';
      else if (altText.includes('coffee')) keywords = 'coffee machine';
      else if (altText.includes('phone')) keywords = 'smartphone';
      else if (altText.includes('jacket')) keywords = 'jacket';
      else if (altText.includes('earbuds')) keywords = 'earbuds';
      
      img.src = `https://source.unsplash.com/featured/800x800/?${keywords}`;
      img.onerror = null;
    };

    vm.addToCart = function () {
      CartService.addItem(vm.product, vm.quantity);
      StateService.pushToast('Added to cart', vm.product.prod_name + ' is ready in your bag.', 'success');
    };

    vm.toggleWishlist = function () {
      var ids = StateService.get('shopsphere_wishlist', []);
      if (ids.indexOf(vm.product.prod_id) > -1) {
        ids = ids.filter(function (id) { return id !== vm.product.prod_id; });
      } else {
        ids.push(vm.product.prod_id);
      }
      vm.wishlistIds = ids;
      StateService.set('shopsphere_wishlist', ids);
    };

    ProductService.getById($routeParams.id).then(function (product) {
      vm.product = product;
      return ProductService.getCatalog({ category: product.cat_slug });
    }).then(function (products) {
      vm.relatedProducts = products.filter(function (item) { return item.prod_id !== vm.product.prod_id; }).slice(0, 3);
    });
  }]);
}());

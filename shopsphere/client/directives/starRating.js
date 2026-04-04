(function () {
  angular.module('ShopSphereApp').directive('starRating', function () {
    return {
      restrict: 'E',
      scope: {
        rating: '='
      },
      template:
        '<div class="rating" aria-label="Rated {{rating || 0}} out of 5">' +
        '  <span ng-repeat="star in stars track by $index" ng-class="{ filled: star <= rounded }">*</span>' +
        '  <small>{{rating || 0}}</small>' +
        '</div>',
      link: function (scope) {
        scope.stars = [1, 2, 3, 4, 5];
        scope.$watch('rating', function (value) {
          scope.rounded = Math.round(value || 0);
        });
      }
    };
  });
}());

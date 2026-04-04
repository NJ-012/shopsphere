(function () {
  angular.module('ShopSphereApp').directive('draggableItem', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var active = false;
        var offsetX = 0;
        var offsetY = 0;

        element.css({ position: 'absolute', cursor: 'grab' });

        element.on('mousedown', function (event) {
          active = true;
          offsetX = event.offsetX;
          offsetY = event.offsetY;
          element.css('cursor', 'grabbing');
        });

        angular.element(window).on('mousemove', function (event) {
          if (!active) {
            return;
          }
          element.css({
            left: (event.pageX - offsetX) + 'px',
            top: (event.pageY - offsetY) + 'px'
          });
        });

        angular.element(window).on('mouseup', function () {
          active = false;
          element.css('cursor', 'grab');
        });
      }
    };
  });
}());

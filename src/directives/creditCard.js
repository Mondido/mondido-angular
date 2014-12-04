(function(){
'use strict';
angular.module('mondido.directives.cardNumber', [])
  .directive('cardNumber', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('keyup', function(e){
          console.log('key up', e);
        });
      }
    };
  }
  ]);
})();

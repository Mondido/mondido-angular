(function(){
'use strict';
angular.module('mondido.directives.cardNumber', [])
  .directive('cardNumber', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var cardTypes = {
          amex: {
            pattern: /^3[47]/,
            valid_length: [15]
          }, 
          diners_club_carte_blanche: {
            pattern: /^30[0-5]/,
            valid_length: [14]
          }, 
          diners_club_international: {
            pattern: /^36/,
            valid_length: [14]
          }, 
          jcb: {
            pattern: /^35(2[89]|[3-8][0-9])/,
            valid_length: [16]
          }, 
          laser: {
            pattern: /^(6304|670[69]|6771)/,
            valid_length: [16, 17, 18, 19]
          }, 
          visa_electron: {
            pattern: /^(4026|417500|4508|4844|491(3|7))/,
            valid_length: [16]
          }, 
          visa: {
            pattern: /^4/,
            valid_length: [16]
          }, 
          mastercard: {
            pattern: /^5[1-5]/,
            valid_length: [16]
          }, 
          maestro: {
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
          }, 
          discover: {
            pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            valid_length: [16]
          }
        };

        function isValidLength(length, card){
        
        }

        element.on('keyup', function(e){
          var value = element.val().replace(/\s/g, '');
          for(var i in card_types) {
            var card = card_types[i];
            var match = value.match(card.pattern);
            if (match !== null) { // card number value matches a card type
              console.log(card.name);
            }
          }
        });
      }
    };
  }
  ]);
})();

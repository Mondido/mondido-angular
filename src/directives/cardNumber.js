(function(){
'use strict';

angular.module('mondido.directives.cardNumber', [])
  .directive('cardNumber', ['$window', function ($window) {
    return {
      restrict: 'A',
			require: '^form',
      link: function (scope, element, attrs, form) {
				var callback = scope[attrs['cardNumber']] || function(validObject){ console.log('implicit', validObject); };
        var cardTypes = [
          {
            name: 'amex',
            pattern: /^3[47]/,
            validLength: [15]
          }, {
            name: 'diners_club_carte_blanche',
            pattern: /^30[0-5]/,
            validLength: [14]
          }, {
            name: 'diners_club_international',
            pattern: /^36/,
            validLength: [14]
          }, {
            name: 'jcb',
            pattern: /^35(2[89]|[3-8][0-9])/,
            validLength: [16]
          }, {
            name: 'laser',
            pattern: /^(6304|670[69]|6771)/,
            validLength: [16, 17, 18, 19]
          }, {
            name: 'visa_electron',
            pattern: /^(4026|417500|4508|4844|491(3|7))/,
            validLength: [16]
          }, {
            name: 'visa',
            pattern: /^4/,
            validLength: [16]
          }, {
            name: 'mastercard',
            pattern: /^5[1-5]/,
            validLength: [16]
          }, {
            name: 'maestro',
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            validLength: [12, 13, 14, 15, 16, 17, 18, 19]
          }, {
            name: 'discover',
            pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            validLength: [16]
          }
        ];


        function isValidLength(cardNumber, card){
         return card.validLength.indexOf(cardNumber.length) > -1;
        }

        function formatCardNumber(element){
          var cardNumber = element.val().replace(/\s/g, '');
          var chunks = [];
          for (var i = 0; i < cardNumber.length; i+=4) {
            chunks.push(cardNumber.substr(i,4));
          }
          element.val(chunks.join(' '));
        }

        function makeInputValid(element){
					form.$setValidity('credit-card', true);
					element.addClass('ng-valid');
					element.removeClass('ng-invalid');
        }

        function makeInputNotValid(element){
					form.$setValidity('credit-card', false);
					element.addClass('ng-invalid');
					element.removeClass('ng-valid');
        }

        function clearCardTypeClasses(element){
          var classes = element.className.split(' ');
          for (var i in cardTypes){
            var name = cardTypes[i].name;
            var index = classes.indexOf(name);
            if (index !== -1){
              classes.splice(index,1);
            }
          }
          scope.$apply(function(){
            element.className = classes.join(' ');
          });
        }

				function isValid(element){
          var cardNumber = element.val().replace(/\s/g, '');
          var match;
          for(var i in cardTypes) {
            var card = cardTypes[i];
            match = cardNumber.match(card.pattern);
            if (match !== null) { // card number value matches a card type
              if (isValidLength(cardNumber, card)) {
                return {valid: true, cardType: card.name};
              } else {
								return {valid: false, cardType: card.name};
              }
              break;
            }
          }
          if (match === null) {
						return {valid: false, cardType: null};
          }
				}

				function validation(element){
					var validObject = isValid(element);
					if (validObject.valid) {
						makeInputValid(element);
					} else {
						makeInputNotValid(element);
					}
					callback(validObject);
				}

        element.on('keyup', function(e){
          var element = $(e.target);
						if ([37,38,39,40,16,17,18,91].indexOf(e.which) === -1 && attrs.format === 'true') {
						scope.$apply(function(){
							formatCardNumber(element);
						});
					}
					validation(element);
        });

				makeInputNotValid(element);
      }
    };
  }
  ]);
})();

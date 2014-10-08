mondido-angular
===============

An angular directive for consuming the Mondido Payments API.

Installation
===
Install using bower
`bower install mondido-angular --save`

Or install the ol' regular way by including `mondido.directive.js` in your project.

Implementation
===

The app
---
Add `mondido` as a dependency.

<pre>
angular.module('eCommerceApp', ['mondido'])
</pre>


The controller
---
<pre>
    $scope.payment = {};

    $scope.payment.amount = '1.00';
    $scope.payment.paymentRef = '';
    $scope.payment.currency = 'SEK';
    $scope.payment.hash = '';
    $scope.payment.merchantId = '1';

    $scope.mondidoConfig = {
      url: 'http://api.mondido.com/v1/transactions',
      success: function(transaction){
        window.alert('success: Transaction '+transaction.id);
        console.log(transaction);
      },
      error: function(err){
        window.alert('error: ' + err.description);
        console.log(err);
      },
      finished: function(err, transaction){
        console.log('finished', err, transactions);
      },
      encryptedParameters: ['cardNumber', 'cardHolder', 'cardCvv', 'cardExpiry'],
      publicKey: '-----BEGIN PUBLIC KEY-----\ YOUR PUBLIC KEY -----END PUBLIC KEY-----\n'
    };
</pre>


The view
---
Coming soon...

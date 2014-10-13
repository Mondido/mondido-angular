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
    $scope.payment = {
      amount: '1.00',
      currency: 'SEK',
      merchant_id: '1'
    };    

    $scope.mondidoConfig = {            
      // API endpoint, (optional, defaults to https://api.mondido.com/v1/transactions)
      url: 'http://api.mondido.com/v1/transactions',
      // Prepare order for payment processing (optional)
      prepare: function(done){
        Order.create($scope.payment, function(order){
          $scope.payment.payment_ref = order.payment_ref;
          $scope.payment.hash = order.hash;
          done();
        });
      },
      // Callback after successful payment
      success: function(transaction){
        window.alert('success: Transaction '+transaction.id);
      },
      // Callback after failed payment
      error: function(err){
        window.alert('error: ' + err.description);
      },
      // Callback after payment request, regardless of status
      complete: function(jqXHR, textStatus){
        console.log('complete', jqXHR, textStatus);
      },
      // Define which parameters should be encrypted
      encrypted_parameters: ['card_number', 'card_holder', 'card_cvv', 'card_expiry'],
      // Your public key, can be found in the settings page for your merchant (https://mondido.com/settings)
      public_key: '-----BEGIN PUBLIC KEY----- Insert your public key... ----END PUBLIC KEY-----\n'
    };
</pre>


The view
---

<pre>
  &lt;form payment-config="mondidoConfig" ng-model="payment"&gt;
    &lt;label for="card_holder"&gt;Namn på kort&lt;/label&gt;
    &lt;input type="text" ng-model="payment.card_holder"/&gt;

    &lt;label for="card_number"&gt;Kortnummer&lt;/label&gt;
    &lt;input type="text" ng-model="payment.card_number"/&gt;
    
    &lt;label for="card_cvv"&gt;CVV&lt;/label&gt;
    &lt;input type="text" ng-model="payment.card_cvv"/&gt;
    
    &lt;label for="card_expiry"&gt;Utångsdatum&lt;/label&gt;
    &lt;input type="text" ng-model="payment.card_expiry"/&gt;
    
    &lt;label for="card_type"&gt;Korttyp&lt;/label&gt;
    &lt;input type="text" ng-model="payment.card_type"/&gt;
    
    &lt;input type="hidden" ng-model="payment.amount"/&gt;
    &lt;input type="hidden" ng-model="payment.payment_ref"/&gt;
    &lt;input type="hidden" ng-model="payment.currency"/&gt;
    &lt;input type="hidden" ng-model="payment.merchant_id"/&gt;
    &lt;input type="hidden" ng-model="payment.hash"/&gt;
    
    &lt;button&gt;Pay&lt;/button&gt;
  &lt;/form&gt;

  &lt;div ng-show="mondido.waitingForMpi"&gt;
    Waiting for MPI
  &lt;/div&gt;
</pre>

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
  &lt;form payment-config="mondidoConfig" ngModel="payment"&gt;
    &lt;div class="form-group"&gt;
      &lt;label for="card_holder"&gt;Namn på kort&lt;/label&gt;
      &lt;input type="text" id="card_holder" ng-model="payment.card_holder" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="row"&gt;
      &lt;div class="form-group col-sm-6"&gt;
        &lt;label for="card_number"&gt;Kortnummer&lt;/label&gt;
        &lt;input type="text" id="card_number" ng-model="payment.card_number" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="card_cvv"&gt;CVV&lt;/label&gt;
        &lt;input type="text" id="card_cvv" ng-model="payment.card_cvv" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="card_expiry"&gt;Utångsdatum&lt;/label&gt;
        &lt;input type="text" id="card_expiry" ng-model="payment.card_expiry" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="card_type"&gt;Korttyp&lt;/label&gt;
        &lt;input type="text" id="card_type" ng-model="payment.card_type" class="form-control" /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="row"&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="amount"&gt;Summa&lt;/label&gt;
        &lt;input type="text" id="amount" ng-model="payment.amount" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="payment_ref"&gt;Paym. Ref&lt;/label&gt;
        &lt;input type="text" id="payment_ref" ng-model="payment.payment_ref" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="currency"&gt;Valuta&lt;/label&gt;
        &lt;input type="text" id="currency" ng-model="payment.currency" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-2"&gt;
        &lt;label for="merchant_id"&gt;Merch&lt;/label&gt;
        &lt;input type="text" id="merchant_id" ng-model="payment.merchant_id" class="form-control" /&gt;
      &lt;/div&gt;
      &lt;div class="form-group col-sm-4"&gt;
        &lt;label for="hash"&gt;Hash&lt;/label&gt;
        &lt;input type="text" id="hash" ng-model="payment.hash" class="form-control" /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="form-group"&gt;
      &lt;button class="btn btn-primary"&gt;Betala&lt;/button&gt;
    &lt;/div&gt;
  &lt;/form&gt;
</pre>

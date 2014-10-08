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
    $scope.payment.paymentRef = 'payref';
    $scope.payment.currency = 'SEK';
    $scope.payment.hash = 'hash';
    $scope.payment.merchantId = '1';

    $scope.mondidoConfig = {
      url: 'http://api.localmondido.com:3000/v1/transactions',
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

<pre>
&lt;form payment-form="mondidoConfig"&gt;
  &lt;div class="form-group"&gt;
    &lt;label for="card_holder"&gt;Namn på kort&lt;/label&gt;
    &lt;input type="text" id="card_holder" ng-model="payment.cardHolder" class="form-control" /&gt;
  &lt;/div&gt;
  &lt;div class="row"&gt;
    &lt;div class="form-group col-sm-6"&gt;
      &lt;label for="card_number"&gt;Kortnummer&lt;/label&gt;
      &lt;input type="text" id="card_number" ng-model="payment.cardNumber" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="card_cvv"&gt;CVV&lt;/label&gt;
      &lt;input type="text" id="card_cvv" ng-model="payment.cardCvv" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="card_expiry"&gt;Utångsdatum&lt;/label&gt;
      &lt;input type="text" id="card_expiry" ng-model="payment.cardExpiry" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="card_type"&gt;Korttyp&lt;/label&gt;
      &lt;input type="text" id="card_type" ng-model="payment.cardType" class="form-control" /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="row"&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="amount"&gt;Summa&lt;/label&gt;
      &lt;input type="text" id="amount" ng-model="payment.amount" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="payment_ref"&gt;Paym. Ref&lt;/label&gt;
      &lt;input type="text" id="payment_ref" ng-model="payment.paymentRef" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="currency"&gt;Valuta&lt;/label&gt;
      &lt;input type="text" id="currency" ng-model="payment.currency" class="form-control" /&gt;
    &lt;/div&gt;
    &lt;div class="form-group col-sm-2"&gt;
      &lt;label for="merchant_id"&gt;Merch&lt;/label&gt;
      &lt;input type="text" id="merchant_id" ng-model="payment.merchantId" class="form-control" /&gt;
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

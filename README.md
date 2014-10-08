mondido-angular
===============

An angular directive for consuming the Mondido Payments API.

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

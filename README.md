mondido-angular
===============

An angular directive for consuming the Mondido Payments API.

Installation
===
Install using bower
`bower install mondido-angular --save`

Or install the ol' regular way by including `mondido-angular.min.js` in your project.

Usage
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
      amount: '110.00',
      currency: 'USD',
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

## The configuration object
### Properties
####url  
**string** The API endpoint. This can be your own backend or a Mondido API endpoint.

####prepare(done)  
**function** An optional function to run before the actual payment request is performed, useful for preparing the order in your backend and returning the hash.

Gets called with a callback method as an argument. You need to call this function when the payment is ready to be processed, this enables asyncronous setup before the request.

####success(transaction)
**function** An optional callback function that is called after a successful payment.

Gets called with the newly created transaction as an argument. See <https://www.mondido.com/documentation/api#transaction> for more information about the transaction object.

####error(err)
**function** An optional callback function that is called after a failed payment.  

Gets called with with an error object as an argument. See <https://www.mondido.com/documentation/api#errors> for a complete list of error messages.

####complete(jqXHR, textStatus)
**function** An optional callback function that is called after the request, regardless of outcome.  

Gets called with the full jqXHR object and tht http status as a string ([see jQuery doc](http://api.jquery.com/jquery.ajax/)) 

####encrypted_parameters
**array** The parameters you wish to encrypt before posting them to the API endpoint.

####public_key
**string** Your public key. You find it under the merchant settings in the admin page. **required for encryption*


The view
---

<pre>
  &lt;form payment-config="mondidoConfig" ng-model="payment"&gt;
    &lt;input type="hidden" ng-model="payment.amount"/&gt;
    &lt;input type="hidden" ng-model="payment.payment_ref"/&gt;
    &lt;input type="hidden" ng-model="payment.currency"/&gt;
    &lt;input type="hidden" ng-model="payment.merchant_id"/&gt;
    &lt;input type="hidden" ng-model="payment.hash"/&gt;
    
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

    &lt;button&gt;Pay&lt;/button&gt;
  &lt;/form&gt;

  &lt;!-- Optional, show a message while performing the 3D Secure check --&gt;
  &lt;div ng-show="mondido.waitingForMpi"&gt;
    Waiting for MPI
  &lt;/div&gt;
</pre>

#### Payment form directive
The payment-config directive mondidifies your form, so that it can send encrypted data to us or your back-end. You need to provide the **configuration object** and the **payment model** for the directive to work. Name them what you want, and let the directive know by providing the `payment-config` and `ng-model` attributes.

##### Optional loader, overlay or whatever
In case you are using 3D Secure, the directive also provides the **mondido.waitingForMpi** boolean, which will resolve to true while the 3D Secure window is open.

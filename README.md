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
angular.module('eCommerceApp', ['<strong>mondido</strong>'])
</pre>


The controller
---
<pre>
    <strong>$scope.payment</strong> = {
      amount: '110.00',
      currency: 'USD',
      merchant_id: '1'
    };    

    <strong>$scope.mondidoConfig</strong> = {            
      // API endpoint, (optional, defaults to https://api.mondido.com/v1/transactions)
      <strong>url</strong>: 'http://api.mondido.com/v1/transactions',
      // Prepare order for payment processing (optional)
      <strong>prepare</strong>: function(done){
        // Here "Order" would be your own model, this is just for demonstration purposes
        Order.create($scope.payment, function(order){
          $scope.payment.payment_ref = order.payment_ref;
          $scope.payment.hash = order.hash;
          done();
        });
      },
      // Callback after successful payment
      <strong>success</strong>: function(transaction){
        window.alert('success: Transaction '+transaction.id);
      },
      // Callback after failed payment
      <strong>error</strong>: function(err){
        window.alert('error: ' + err.description);
      },
      // Callback after payment request, regardless of status
      <strong>complete</strong>: function(jqXHR, textStatus){
        console.log('complete', jqXHR, textStatus);
      },
      // Define which parameters should be encrypted
      <strong>encrypted_parameters</strong>: ['card_number', 'card_holder', 'card_cvv', 'card_expiry'],
      // Your public key, can be found in the settings page for your merchant (https://mondido.com/settings)
      <strong>public_key</strong>: '-----BEGIN PUBLIC KEY----- Insert your public key... ----END PUBLIC KEY-----\n'
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

#### mpi
**boolean** *optional (defaults to true)* Whether or not to use MPI (3D Secure)

####encrypted_parameters
**array** The parameters you wish to encrypt before posting them to the API endpoint.

####public_key
**string** Your public key. You find it under the merchant settings in the admin page. **required for encryption*


The view
---

<pre>
  &lt;form <strong>payment-config</strong>="mondidoConfig" <strong>ng-model</strong>="payment"&gt;
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

## Card number 
Our angular plug-in comes with an optional directive for your card number input, which will validate the length of the card number, detect card type and optionally format the input with spaces at every 4th position.

The directive sets the validity of the form and input field including the ng-valid and ng-invalid classes.

Use it by adding the **credit-card** attribute to your input field, and optionally send in a callback as the value of the attribute. You can also add `format="true"` for card number formatting.
### The view

	<input type="text" ng-model="payment.card_number" card-number="ccKeyUp" format="true" />

### The controller
	$scope.ccKeyUp = function(cardValidation){
		// Triggered at key up in the card 
	}
The cardValidation object has the properties *bool* **valid** and *string* **cardType**



MPI (3D Secure)
---
The directive will provide the scope with a **mondido.isLoading** boolean, which resolves to true while an API call is being processed.

The directive also provides the **mondido.waitingForMpi** boolean, which will resolve to true while the user is going through the MPI flow.

The MPI authorization will be performed in a new window. If an older, incompatible, version of Internet Explorer is being used, MPI will fall back to an iFrame. If so, you will have the **#mpi-iframe** and **#mpi-overlay** (div) that you can style using CSS.

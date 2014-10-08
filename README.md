mondido-angular
===============

An angular directive for consuming the Mondido Payments API.

The view
---

<code>
  <form>
    <div class="form-group">
      <label for="card_holder">Namn på kort</label>
      <input type="text" id="card_holder" ng-model="payment.cardHolder" class="form-control" />
    </div>
    <div class="row">
      <div class="form-group col-sm-6">
        <label for="card_number">Kortnummer</label>
        <input type="text" id="card_number" ng-model="payment.cardNumber" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="card_cvv">CVV</label>
        <input type="text" id="card_cvv" ng-model="payment.cardCvv" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="card_expiry">Utångsdatum</label>
        <input type="text" id="card_expiry" ng-model="payment.cardExpiry" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="card_type">Korttyp</label>
        <input type="text" id="card_type" ng-model="payment.cardType" class="form-control" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-sm-2">
        <label for="amount">Summa</label>
        <input type="text" id="amount" ng-model="payment.amount" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="payment_ref">Paym. Ref</label>
        <input type="text" id="payment_ref" ng-model="payment.paymentRef" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="currency">Valuta</label>
        <input type="text" id="currency" ng-model="payment.currency" class="form-control" />
      </div>
      <div class="form-group col-sm-2">
        <label for="merchant_id">Merch</label>
        <input type="text" id="merchant_id" ng-model="payment.merchantId" class="form-control" />
      </div>
      <div class="form-group col-sm-4">
        <label for="hash">Hash</label>
        <input type="text" id="hash" ng-model="payment.hash" class="form-control" />
      </div>
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Betala</button>
    </div>
  </form>
</code>

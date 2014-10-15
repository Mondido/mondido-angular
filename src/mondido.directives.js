(function(){
'use strict';

angular.module('mondido.directives', ['mondido.encryption'])
  .directive('paymentConfig', ['$window', 'encryptString', function ($window, encryptString) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var mpiWindow;
        var payment = scope[attrs.ngModel];
        var config = scope[attrs.paymentConfig];
        scope.mondido = {};



        function createPayloadFromData(data){
          var payload = {};
          var encrypted = [];
          var config = scope[attrs.paymentConfig];
          if (typeof config.encrypted_parameters !== 'undefined' && $.isArray(config.encrypted_parameters)) {
            encrypted = config.encrypted_parameters;
          }

          for (var prop in data) {
            if (encrypted.indexOf(prop) > -1) {
              payload[prop] = encryptString(data[prop], config.public_key);
            } else {
              payload[prop] = data[prop];
            }
          }

          payload.encrypted = encrypted.join(',');

          return payload;
        }

        // Open a new window that will later get the MPI post
        function openMpi(){          
          mpiWindow = $window.open('', 'mpi-window', 'width=640,height=480,top=200,left=500');
          scope.mondido.waitingForMpi = true;

          function checkMpiWindowStatus(){
            if (mpiWindow.closed) {
              scope.$apply(function(){
                scope.mondido.waitingForMpi = false;
              });
            } else {
              setTimeout(checkMpiWindowStatus, 200);
            }
          }
          checkMpiWindowStatus();

        }


        // Create a form and post it the MPI endpoint
        function postToMpi(){
          var payload = createPayloadFromData(payment);
          var mpiPostForm = $(document.createElement('form'))
            .attr('action', 'http://pay.localmondido.com:3000/v1/mpi_js')
            .attr('method', 'POST')
            .attr('target', 'mpi-window')
            .appendTo('body');

          for (var prop in payload) {
            $(document.createElement('input'))
              .attr('name', prop)
              .attr('type', 'hidden')
              .val(payment[prop])
              .appendTo(mpiPostForm);
          }
          mpiPostForm.submit();
        }

        // Gets called back after MPI flow is finshed
        // Adds MPI attributes and then calls the Mondido API
        function mpiCallback(e){
          var data = null;
          try {
            data = $.parseJSON(e.data);
          } catch(exception) {
            return false;
          }
          if (!data || data.event !== 'mpi') {
            return false;
          } else {
            mpiWindow.close();
            scope.$apply(function(){
              scope.mondido.waitingForMpi = false;
            });

            if (data.success) {
              payment.ref = data.mpi_ref;
              payment.eci = data.eci;
              payment.provider_ref = data.provider_ref;
              callApi();
            }
          }
        }

        // Call the Mondido API endpoint configured in the scope
        // then call adequate callbacks if configured in the config
        function callApi(){
          $.ajax({
            type: 'POST',
            url: config.url || 'https://api.mondido.com/v1/transactions',
            data: createPayloadFromData(payment),
            success: function(r){
              if (typeof config.success === 'function') {
                config.success(r);
                scope.$digest();
              }
            },
            error: function(r){
              if (typeof config.error === 'function') {
                config.error(r.responseJSON || $.parseJSON(r.responseText));
                scope.$digest();
              }
            },
            complete: function(jqXHR, textStatus){
              if (typeof config.complete === 'function') {
                config.complete(jqXHR, textStatus);
                scope.$digest();
              }
            }
          });
        }
       
        if ($window.addEventListener) {
          $window.addEventListener('message', mpiCallback, false);
        } else {
          $window.attachEvent('onmessage', mpiCallback);
        }

        // Open MPI window and run the user configured prepare method before proceeding with the MPI process
        // We need to pop the window here because browsers will block it in the done callback
        element.bind('submit', function(){
          openMpi();

          function done(){
            postToMpi();
            return;
          }

          // Run the prepare method if the user defined it, else just proceed
          if (config.prepare && typeof config.prepare === 'function') {
            config.prepare(done);
          } else {
            done();
          }
        });
      }
    };
  }]);
})();

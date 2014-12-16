(function(){
'use strict';
angular.module('mondido.directives.paymentConfig', ['mondido.encryption'])
  .directive('paymentConfig', ['$window', 'encryptString', function ($window, encryptString) {
    return {
      restrict: 'A',
			require: '^form',
      link: function (scope, element, attrs, form) {
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
          var oldIePattern = /MSIE\s([0-9]\.[0-9]);/;
          var ieMatch = oldIePattern.exec(navigator.userAgent);
          var isOldIe;

          if (ieMatch) {
            var ieVersion = parseFloat(ieMatch[1]);
            if (ieVersion < 10) {
              isOldIe = true;
            }
          }
          
          if (isOldIe) {
            openMpiIframe();
          } else {
            openMpiWindow();
          }
        }

        function openMpiWindow(){
          mpiWindow = $window.open('', 'mpiwindow', 'width=640,height=480,top=200,left=500');
          scope.mondido.waitingForMpi = true;

          function checkMpiWindowStatus(){
            if (mpiWindow && mpiWindow.closed) {
              scope.$apply(function(){
                scope.mondido.waitingForMpi = false;
              });
            } else {
              setTimeout(checkMpiWindowStatus, 200);
            }
          }
          checkMpiWindowStatus();
        }

        function openMpiIframe(){
          scope.mondido.waitingForMpi = true;

          scope.$apply(function(){
            var mpiOverlay = $(document.createElement('div')).appendTo('body').attr('id', 'mpi-overlay');
            mpiWindow = $(document.createElement('iframe')).css({width: 640, height: 480}).attr('id', 'mpi-iframe').attr('name', 'mpiwindow').appendTo(mpiOverlay);
          });

        }

        function closeMpiWindow(){        
          if (mpiWindow.location) {
            mpiWindow.close();
          } else {
            mpiWindow.parent().remove();
          }
          mpiWindow = null;
        }


        // Create a form and post it the MPI endpoint
        function postToMpi(){
          var payload = createPayloadFromData(payment);
          var mpiPostForm = $(document.createElement('form'))
            .attr('action', 'https://pay.mondido.com/v1/mpi_js')
            .attr('method', 'POST')
            .attr('target', 'mpiwindow')
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
            closeMpiWindow();
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
					scope.mondido.isLoading = true;

					var options = {
            type: 'POST',
            url: config.url || 'https://api.mondido.com/v1/transactions',
            data: createPayloadFromData(payment),
            success: function(r){
              scope.$apply(function(){
                scope.mondido.isLoading = false;
              });
              if (typeof config.success === 'function') {
                config.success(r);
                scope.$digest();
              }
            },
            error: function(r){
              scope.$apply(function(){
                scope.mondido.isLoading = false;
              });
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
					};

          $.ajax(options);
        }
       
        if ($window.addEventListener) {
          $window.addEventListener('message', mpiCallback, false);
        } else {
          $window.attachEvent('onmessage', mpiCallback);
        }


        if ( window.XDomainRequest ) {
          jQuery.ajaxTransport(function( s ) {
            if ( s.crossDomain && s.async ) {
              if ( s.timeout ) {
                s.xdrTimeout = s.timeout;
                delete s.timeout;
              }
              var xdr;
              return {
                send: function( _, complete ) {
                  function callback( status, statusText, responses, responseHeaders ) {
                    xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                    xdr = undefined;
                    complete( status, statusText, responses, responseHeaders );
                  }
                  xdr = new XDomainRequest();
                  xdr.onload = function() {
                    callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
                  };
                  xdr.onerror = function() {
                    callback( 404, "Not Found" );
                  };
                  xdr.onprogress = jQuery.noop;
                  xdr.ontimeout = function() {
                    callback( 0, "timeout" );
                  };
                  xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
                  xdr.open( s.type, s.url );
                  xdr.send( ( s.hasContent && s.data ) || null );
                },
                abort: function() {
                  if ( xdr ) {
                    xdr.onerror = jQuery.noop;
                    xdr.abort();
                  }
                }
              };
            }
          });
        }


        // Open MPI window and run the user configured prepare method before proceeding with the MPI process
        // We need to pop the window here because browsers will block it in the done callback
        element.bind('submit', function(){
					if (!form.$valid) {
						return false;
					}

          if (config.mpi !== false) {
            openMpi();
          }

          function done(){
            if (config.mpi !== false) {
              postToMpi();
            } else {
              callApi();
            }
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

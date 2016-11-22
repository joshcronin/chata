var chatController = angular.module('chatController', []);

chatController.controller("chat", ['Pubnub', '$pubnubChannel', '$firebaseAuth', '$scope', '$location', '$http',
  function(Pubnub, $pubnubChannel, $firebaseAuth, $scope, $location, $http) {

    $scope.messageList = $pubnubChannel('chata', {
      autoload: 0
    });

    $scope.message = ''; // Users message

    $scope.error = {
      message: "", //Message to be shown in form
      show: false //If true, message will be visible in form
    };

    $scope.publish = function() {
      $scope.cancelError();
      Pubnub.publish({
          message: {
            content: $scope.message
          },
          channel: 'chata'
        },
        function(status, response) {
          if (status.error) {
            // handle error
            $scope.throwError(error.message);
          } else {
            $scope.message = '';
          }
        }
      );
    }

    //Method to throw error
    $scope.throwError = function(error) {
      $scope.error.message = error || 'Something went wrong. Please try again';
      $scope.error.show = true;
    };

    //Method to cancel error
    $scope.cancelError = function() {
      $scope.error.show = false;
    };
  }
]);

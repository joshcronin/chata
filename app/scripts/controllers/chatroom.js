var chatController = angular.module('chatController', []);

chatController.controller("chat", ['Pubnub', '$firebaseAuth', '$scope', '$location', '$http',
  function(Pubnub, $firebaseAuth, $scope, $location, $http) {

    Pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNUnknownCategory") {
          var newState = {
            new: 'error'
          };
          Pubnub.setState({
              state: newState
            },
            function(status) {
              console.log(statusEvent.errorData.message)
            }
          );
        }
      },
      message: function(message) {
        console.log(message)
      }
    })

    Pubnub.subscribe({
      channels: ['chata']
    });

    $scope.message = ''; // Users message
    $scope.publish = function() {
      Pubnub.publish({
          message: {
            such: $scope.message
          },
          channel: 'chata'
        },
        function(status, response) {
          if (status.error) {
            // handle error
            console.log(status)
          } else {
            console.log("message Published w/ timetoken", response.timetoken)
          }
        }
      );
    }
  }
]);

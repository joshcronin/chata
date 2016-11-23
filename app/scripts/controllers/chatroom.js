var chatController = angular.module('chatController', []);

chatController.controller("chat", ['User' '$firebaseObject','Pubnub', '$pubnubChannel', '$firebaseAuth', '$scope', '$location', '$http',
  function(User, $firebaseObject, Pubnub, $pubnubChannel, $firebaseAuth, $scope, $location, $http) {

    $scope.messageList = $pubnubChannel('chata', {
      autoload: 0
    });

    var nameRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid + '/name/');
    var user = $firebaseObject(nameRef);

    user.$loaded().then(function(user) {
      $scope.username = user.$value;
    });

    $scope.message = ''; // Users message
    $scope.username = ''; // Users username

    $scope.error = {
      message: "", //Message to be shown in form
      show: false //If true, message will be visible in form
    };

    $scope.publish = function() {
      $scope.cancelError();
      Pubnub.publish({
          message: {
            content: $scope.message,
            username: $scope.username,
            profilePic: User.getProfileUrl(),
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

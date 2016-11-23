var chatController = angular.module('chatController', []);

chatController.controller("chat", ['User','$rootScope', 'Pubnub', '$pubnubChannel', '$firebaseAuth', '$scope', '$location', '$http',
  function(User, $rootScope, Pubnub, $pubnubChannel, $firebaseAuth, $scope, $location, $http) {

    //Get viewport height
    $scope.viewportHeight = window.innerHeight;

    //On route loaded
    $scope.$on('$viewContentLoaded', function(){
      var messagePanelHeight = $scope.viewportHeight;
      messagePanelHeight -= $('.navbar').outerHeight(true);//Header height
      messagePanelHeight -= $('.message-box').outerHeight(true);//Message area height
      messagePanelHeight -= 15;//Margin at the bottom

      messagePanelHeight = Math.floor(messagePanelHeight);//Round down

      $('.main-chat').height(messagePanelHeight);//Set the message panel height
    });

    $scope.messageList = $pubnubChannel('chata', {
      autoload: 10,
    });

    User.getUsername().then(function(user) {
      $scope.username = user.name;
    });

    $scope.message = ''; // Users message
    $scope.username = ''; // Users username

    User.getProfileUrl().then(function(url) {
      $scope.profileUrl = url;
    });

    $scope.error = {
      message: "", //Message to be shown in form
      show: false //If true, message will be visible in form
    };

    //Method to handle enter key
    $scope.enterToSend = function(keyEvent) {
      //If enter key, but not shift key
      if (keyEvent.keyCode == 13 && !keyEvent.shiftKey) {
        //Prevent default behaviour
        keyEvent.preventDefault();
        //Publish message
        $scope.publish();
      }
    }

    $scope.publish = function() {
      $scope.cancelError();
      Pubnub.publish({
          message: {
            content: $scope.message,
            username: $scope.username,
            profilePic: $scope.profileUrl,
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

    //Get profile image URL
    $rootScope.getProfileImage($firebaseAuth, 'profile_thumb');
  }
]);

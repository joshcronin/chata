var loginController = angular.module('loginController', []);

loginController.controller("login", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {
    $scope.authObj = $firebaseAuth();

    //Error content
    $scope.error = {
      message: "Username or password incorrect", //Message to be shown in form
      show: false //If true, message will be visible in form
    };

    $scope.usr_email = ''; //The email field value
    $scope.usr_password = ''; //The password field value

    //Method called on form submit
    $scope.submit = function() {
      $firebaseAuth().$signInWithEmailAndPassword($scope.usr_email, $scope.usr_password).then(function(firebaseUser) {
        // Temporary before we have authenticated routes
        console.log("Signed in as:", firebaseUser.uid);
        $location.path('chatroom');
      }).catch(function(error) {
        $scope.throwError();
      });
      //If there is an error use this method
    };

    //Method to throw error
    $scope.throwError = function() {
      $scope.error.show = true;
    };

    //Method to cancel error
    $scope.cancelError = function() {
      $scope.error.show = false;
    };

  }
]);

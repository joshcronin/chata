// Define a new module for chata app. The array holds the names of dependencies if any.
// $firebaseObject, $firebaseArray, and $firebaseAuth can be injected into any controller, service, or factory.
// Pubnub Object is now avaliable
var app = angular.module("chataApp", ["firebase"]);

app.controller("registerController", function($scope, $firebaseAuth) {

  $scope.error = {
    message: "", //Message to be shown in form
    show: false //If true, message will be visible in form
  };

  $scope.user = {
    email: '', //The email field value
    password: '', //The password field value
    username: '', // The username field
  };

  //Method called on form submit
  $scope.submit = function() {
    $firebaseAuth().$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
      .then(function(firebaseUser) {
        var ref = firebase.database().ref();
        ref.child("users").child(firebaseUser.uid).set({
          name: $scope.user.username
        });
      })
      .then(function(firebaseUser) {
        $firebaseAuth().$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
          // Temporary before we have authenticated routes
          console.log("Signed in as:", firebaseUser.uid);
        });
      })
      .catch(function(error) {
        $scope.throwError(error.message);
      });
  };

  //Method to throw error
  $scope.throwError = function(error) {
    $scope.error.message = error || 'Something went wrong. Please try again';
    $scope.error.show = true;
  };

  //Method to cancel error
  $scope.cancelError = function() {
    $scope.error.show = false;
  };
});

var compareTo = function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
};

app.directive("compareTo", compareTo);

// Define a new module for chata app. The array holds the names of dependencies if any.
// $firebaseObject, $firebaseArray, and $firebaseAuth can be injected into any controller, service, or factory.
// Pubnub Object is now avaliable
var app = angular.module("chataApp", ["firebase"]);

app.controller("registerController", function($scope, $firebaseAuth) {

  $scope.user = {
    email: '', //The email field value
    password: '', //The password field value
    username: '', // The username field
  };

  //Method called on form submit
  $scope.submit = function() {

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

var profileController = angular.module('profileController', []);

profileController.controller("profile", ['User', '$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function(User, $firebaseAuth, $firebaseObject, $scope, $location, $http) {
    $scope.user = User.getUser();

    $scope.changePassword = function() {
      $firebaseAuth().$updatePassword($scope.newPassword).then(function() {
        console.log("Password changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeEmail = function() {
      $firebaseAuth().$updateEmail($scope.email).then(function() {
        console.log("Email changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeUsername = function() {
      nameRef.set({
        name: $scope.user.username
      });
    };

    $scope.changeProfilePicture = function() {
      a
    };
  }
]);

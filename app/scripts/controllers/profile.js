var profileController = angular.module('profileController', []);

profileController.controller("profile", ['User', '$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function(User, $firebaseAuth, $firebaseObject, $scope, $location, $http) {
    $scope.user = User.getUser();
    $scope.user.newPassword = null;

    $scope.changePassword = function() {
      User.updatePassword($scope.newPassword).then(function() {
        console.log("Password changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeEmail = function() {
      User.updateEmail($scope.email).then(function() {
        console.log("Email changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeUsername = function() {
      User.updateUsername($scope.user.username);
    };

    $scope.changeProfilePicture = function() {
      User.updateProfilePicture(picture);
    };
  }
]);

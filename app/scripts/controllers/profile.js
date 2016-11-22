var profileController = angular.module('profileController', []);

profileController.controller("profile", ['$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function($firebaseAuth, $firebaseObject, $scope, $location, $http) {
    var nameRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid + '/name/');
    var user = $firebaseObject(nameRef);

    var storage = firebase.storage();
    var pathReference = storage.ref(`images/profile/${$firebaseAuth().$getAuth().uid}/profile`);

    $scope.user = {
      email: $firebaseAuth().$getAuth().email,
      username: '',
      profileUrl: 'img/avatar.png',
      newPassword: null,
    };

    user.$loaded().then(function(user) {
      $scope.user.username = user.$value;
    });

    pathReference.getDownloadURL().then(function(url) {
      $scope.user.profileUrl = url;
    }).catch(function(error) {
      console.log(error);
    });

    $scope.changePassword = function() {
      $firebaseAuth().$updatePassword($scope.newPassword).then(function() {
        console.log("Password changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeEmail = function() {
      $firebaseAuth().$updatePassword().$updateEmail($scope.email).then(function() {
        console.log("Email changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeUsername = function() {
      debugger;
    };
  }
]);

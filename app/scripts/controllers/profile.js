var profileController = angular.module('profileController', []);

profileController.controller("profile", ['$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function($firebaseAuth, $firebaseObject, $scope, $location, $http) {
    var nameRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid + '/name/');

    $scope.user = {
      email: $firebaseAuth().$getAuth().email,
      username: '',
    };

    var user = $firebaseObject(nameRef);

    // to take an action after the data loads, use the $loaded() promise
    user.$loaded().then(function(user) {
       $scope.user.username = user.$value;
    });
  }
]);

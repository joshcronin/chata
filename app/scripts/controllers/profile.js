var profileController = angular.module('profileController', []);

profileController.controller("profile", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {
    $scope.user = {
      email: $firebaseAuth().$getAuth().email,
      username: $scope.getUsername,
    };

    $scope.getUsername = function (){
      var ref = firebase.database().ref();
      ref.child("/users/" + $firebaseAuth().$getAuth().uid + '/name/').once('value').then(function(snap){
        $scope.username = snap.val());
      });
    }
  }
]);

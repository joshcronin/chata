var navController = angular.module('navController', []);

navController.controller("navbar", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {
    $scope.authObj = $firebaseAuth();
  }
]);

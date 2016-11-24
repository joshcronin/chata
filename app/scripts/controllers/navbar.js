var navController = angular.module('navController', []);

navController.controller("navbar", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {

    /**
     * @type {Object} Auth object
     */
    $scope.authObj = $firebaseAuth();
  }
]);

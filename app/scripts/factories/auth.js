var authFactory = angular.module('authFactory', []);

authFactory.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  return $firebaseAuth();
}]);

var authFactory = angular.module('authFactory', []);
/**
* @return {Object} Auth - returns an easy to use short cut for $firebaseAuth
*/
authFactory.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  return $firebaseAuth();
}]);

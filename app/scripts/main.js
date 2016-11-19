// Define a new module for chata app. The array holds the names of dependencies if any.
// $firebaseObject, $firebaseArray, and $firebaseAuth can be injected into any controller, service, or factory.
// Pubnub Object is now avaliable
var chataApp = angular.module("chataApp", ["ngRoute",
  "ngFileUpload",
  "firebase",
  "pubnub.angular.service",
  "loginController",
  "registerController",
  "navController",
  "chatController"
]);

chataApp.run(['Pubnub', function(Pubnub) {
  Pubnub.init({
    publishKey: 'pub-c-81e89e4d-53aa-4a63-a79d-f5515cedec4e',
    subscribeKey: 'sub-c-8ebd3efa-9f52-11e6-aff8-0619f8945a4f'
  });
}]);
chataApp.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/#/");
    }
  });
}]);


chataApp.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/login.html',
        controller: 'login'
      })
      .when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'register'
      })
      .when('/profile', {
        templateUrl: 'templates/profile.html',
      })
      .when('/chatroom', {
        templateUrl: 'templates/chatroom.html',
        controller: 'chat',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      }).otherwise({
        redirectTo: '/'
      });
  }
]);

chataApp.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  return $firebaseAuth();
}]);

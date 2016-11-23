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
  "chatController",
  "authFactory",
  "profileController",
  "userFactory",
  "uploadFactory"
]);

chataApp.run(['Pubnub', "$rootScope", "$location", function(Pubnub, $rootScope, $location) {
  Pubnub.init({
    publishKey: 'pub-c-81e89e4d-53aa-4a63-a79d-f5515cedec4e',
    subscribeKey: 'sub-c-8ebd3efa-9f52-11e6-aff8-0619f8945a4f'
  });

  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the login page
    if (error === "AUTH_REQUIRED") {
      $location.path("/#/");
    }
  });

  //Default profile image URL
  $rootScope.profileImageURL = "/img/icon-profile.png";

  //Set the profile image in nav bar
  $rootScope.getProfileImage = function(firebaseAuth) {
    // Gets picture from firebase
    var storage = firebase.storage().ref('images/profile');
    var uid = firebaseAuth().$getAuth().uid;
    var profileRef = storage.child(uid);

    //Get URL
    profileRef.child('profile').getDownloadURL().then(function(url) {
      //Store in scope
      $rootScope.profileImageURL = url;
      //Create an image object to preload the image
      var img = new Image();
      //Set the src
      img.src = $rootScope.profileImageURL;
      //On load, apply the scope
      img.onload = $rootScope.$apply.bind($rootScope);
    }).catch(function(error) {
      //Fail silently
      //console.error(error);
    });
  };

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
        controller: 'profile',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper
          "currentAuth": ["Auth", function(Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/chatroom', {
        templateUrl: 'templates/chatroom.html',
        controller: 'chat',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper
          "currentAuth": ["Auth", function(Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError
            return Auth.$requireSignIn();
          }]
        }
      }).otherwise({
        redirectTo: '/'
      });
  }
]);

var userFactory = angular.module('userFactory', []);

authFactory.factory("User", ["$firebaseAuth", "$firebaseObject", function($firebaseAuth, $firebaseObject) {
  return {
    getUser: function() {
      var user = {};

      var userRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid);
      var userObj = $firebaseObject(userRef);

      var storage = firebase.storage();
      var pathReference = storage.ref(`images/profile/${$firebaseAuth().$getAuth().uid}/profile`);

      userObj.$loaded().then(function(userObj) {
          user.username = userObj.name;
          return pathReference.getDownloadURL();
        })
        .then(function(url) {
          user.profileUrl = url || 'img/avatar.png';
          user.email = $firebaseAuth().$getAuth().email;
        });
        return user;
    },
    getEmail: function() {

    },
    getUsername: function() {

    },
    getProfileUrl: function() {

    }
  }

}]);

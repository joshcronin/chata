var userFactory = angular.module('userFactory', []);

authFactory.factory("User", ["$firebaseAuth", "$firebaseObject", function($firebaseAuth, $firebaseObject) {
  return {
    getUser: function() {
      var user = {
        email: this.getEmail(),
        profileUrl: '',
        username: ''
      };

      this.getUsername().then((userObj) => {
        user.username = userObj.name;
        return this.getProfileUrl();
      }).then(function(url) {
        user.profileUrl = url || 'img/avatar.png';
      });

      return user;
    },

    getEmail: function() {
      return $firebaseAuth().$getAuth().email;
    },

    getUsername: function() {
      var username = null;
      var userRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid);
      var userObj = $firebaseObject(userRef);

      return userObj.$loaded();

    },

    getProfileUrl: function() {
      var url = null;
      var storage = firebase.storage();
      var pathReference = storage.ref(`images/profile/${$firebaseAuth().$getAuth().uid}/profile`);

      return pathReference.getDownloadURL();
    },

    updatePassword: function(password) {
      return $firebaseAuth().$updatePassword(password);
    },

    updateEmail: function(email) {
      return $firebaseAuth().$updateEmail(email);
    },

    updateUsername: function(username) {
      var userRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid);

      userRef.set({
        name: username
      });
    },

    updateProfilePicture: function(picture) {
      var storage = firebase.storage();
      var pathReference = storage.ref(`images/profile/${$firebaseAuth().$getAuth().uid}/profile`);

      var uploadTask = pathReference.putString(picture, 'base64');

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot) {
          console.log(snapshot);
        },
        function(error) {
          console.log(error);
        },
        function() {
          console.log(`Success: ${uploadTask.snapshot.downloadURL}`);
        }
      );
    },
  }

}]);

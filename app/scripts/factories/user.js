var userFactory = angular.module('userFactory', []);

// User model
authFactory.factory("User", ["UploadImage", "$firebaseAuth", "$firebaseObject", function(UploadImage, $firebaseAuth, $firebaseObject) {
  return {
    /**
     * @return {Object} User with email, username and profileURl
     */
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

    /**
     * @return {String} User email adrress
     */
    getEmail: function() {
      return $firebaseAuth().$getAuth().email;
    },

    /**
     * @return {Promise} User username field
     */
    getUsername: function() {
      var username = null;
      var userRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid);
      var userObj = $firebaseObject(userRef);

      return userObj.$loaded();

    },

    /**
     * @return {Promise} User download url for profile picture
     */
    getProfileUrl: function() {
      var url = null;
      var storage = firebase.storage();
      var pathReference = storage.ref(`images/profile/${$firebaseAuth().$getAuth().uid}/profile`);

      return pathReference.getDownloadURL();
    },

    /**
     * @return {Promise} success or failure of update
     */
    updatePassword: function(password) {
      return $firebaseAuth().$updatePassword(password);
    },

    /**
     * @return {Promise} success or failure of update
     */
    updateEmail: function(email) {
      return $firebaseAuth().$updateEmail(email);
    },

    /**
     * @return {Promise} success or failure of update
     */
    updateUsername: function(username) {
      var userRef = firebase.database().ref("/users/" + $firebaseAuth().$getAuth().uid);

      userRef.set({
        name: username
      });
    },

    /**
     * @param (String) Base64 picture reference
     */
    updateProfilePicture: function(picture) {
      var storage = firebase.storage();
      var pathReference = storage.ref('images/profile/' + $firebaseAuth().$getAuth().uid);

      //Generate large image
      return UploadImage.resizeImage(picture, 350, 350).then(function(encodedImg) {
          // Uploads the file
          return pathReference.child('profile').putString(encodedImg.split(',')[1], 'base64');
        })
        .then((snap) => {
          return UploadImage.resizeImage(picture, 96, 96);
        })
        .then(function(encodedImg) {
          // Uploads the file
          return pathReference.child('profile_thumb').putString(encodedImg.split(',')[1], 'base64');
        });
    },
  };

}]);

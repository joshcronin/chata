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
      var pathReference = storage.ref('images/profile/' + $firebaseAuth().$getAuth().uid);

      //Generate large image
      this.resizeImage(picture, 350, 350).then(function(encodedImg) {
        // Uploads the file
        var uploadTask = pathReference.child('profile').putString(encodedImg.split(',')[1], 'base64');

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            console.log(snapshot);
          },
          function(error) {
            //Fail silently
            //console.log(error);
          },
          function() {
            console.log(uploadTask.snapshot.downloadURL);
          }
        );
      }).catch(function(error) {
        //Fail silently
        //console.log(error);
      });

      //Generate small image
      this.resizeImage(picture, 96, 96).then(function(encodedImg) {
        // Uploads the file
        var uploadTask = pathReference.child('profile_thumb').putString(encodedImg.split(',')[1], 'base64');

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            console.log(snapshot);
          },
          function(error) {
            //Fail silently
            //console.log(error);
          },
          function() {
            console.log(uploadTask.snapshot.downloadURL);
          }
        );
      }).catch(function(error) {
        //Fail silently
        //console.log(error);
      });

    },

    resizeImage: function(img, width, height) {
      //Return a promise
      return new window.Promise(function(resolve, reject) {
        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;

        var image = new Image();
        image.onload = function() {
          //Check width and height of image
          var nativeWidth = this.width,
              nativeHeight = this.height;
          var desiredWidth = 0,
              desiredHeight = 0;
          var offset = {left: 0, top: 0};

          //Scale and position image in canvase
          if (nativeWidth == nativeHeight) {
            desiredHeight = height;
            desiredWidth = width;
          } else if (nativeWidth > nativeHeight) {
            desiredHeight = height;
            desiredWidth = (nativeWidth / (nativeHeight / height));
            offset.left = -((desiredWidth - width) / 2);
          } else {
            desiredWidth = width;
            desiredHeight = (nativeHeight / (nativeWidth / width));
            offset.top = -((desiredHeight - height) / 2);
          }

          ctx.drawImage(image, offset.left, offset.top, desiredWidth, desiredHeight);
          resolve(canvas.toDataURL());
        };
        image.onerror = function(e) {
          reject(Error("There was a problem"));
        }
        image.src = img;
      });
    }
  }

}]);

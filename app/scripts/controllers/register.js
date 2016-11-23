var registerController = angular.module('registerController', []);

registerController.controller("register", ['$firebaseAuth', '$scope', '$location', '$http',
 function($firebaseAuth, $scope, $location, $http) {

  $scope.error = {
    message: "", //Message to be shown in form
    show: false //If true, message will be visible in form
  };

  $scope.user = {
    email: '', //The email field value
    password: '', //The password field value
    username: '', // The username field
    picture: '', // User profile picture
  };

  $scope.getFile = function() {
    document.getElementById("upfile").click();
  };

  //Method called on form submit
  $scope.submit = function() {
    $firebaseAuth().$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
      .then(function(firebaseUser) {
        // Save the username
        var ref = firebase.database().ref();
        ref.child("users").child(firebaseUser.uid).set({
          name: $scope.user.username
        });

        // Save the users profile picture
        // Gets firebase references and picture
        var storage = firebase.storage().ref();
        var imagesRef = storage.child('images/profile');
        var picture = $('#uploadedPicture').attr('src');//.split(',')[1];

        if (picture) {

          //Generate large image
          $scope.resizeImage(picture, 350, 350).then(function(encodedImg) {
            // Uploads the file
            var uploadTask = imagesRef.child(firebaseUser.uid + '/profile').putString(encodedImg.split(',')[1], 'base64');

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
          $scope.resizeImage(picture, 96, 96).then(function(encodedImg) {
            // Uploads the file
            var uploadTask = imagesRef.child(firebaseUser.uid + '/profile_thumb').putString(encodedImg.split(',')[1], 'base64');

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
        }
      })
      .then(function(firebaseUser) {
        // Sign the user in
        $firebaseAuth().$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
          // Temporary before we have authenticated routes
          console.log("Signed in as:", firebaseUser.uid);
          $location.path('chatroom');
        });
      })
      .catch(function(error) {
        $scope.throwError(error.message);
      });
  };

  //Method to throw error
  $scope.throwError = function(error) {
    $scope.error.message = error || 'Something went wrong. Please try again';
    $scope.error.show = true;
  };

  //Method to cancel error
  $scope.cancelError = function() {
    $scope.error.show = false;
  };

  // Upload a profile picture
  $scope.uploadFiles = function(file) {
    $scope.f = file;
    if (file) {
      // Check if image is valid
      if ($scope.validUpload(file)) {
        var reader = new FileReader();
        reader.onload = function(e) {

          // Set thumbnail
          $('#uploadedPicture')
            .attr('src', e.target.result)
            .width(100)
            .height(100);
        };
        reader.readAsDataURL(file);
      } else {
        $scope.throwError('Could not upload image');
      }
    }
  };

  $scope.resizeImage = function(img, width, height) {
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
        if (nativeWidth >= nativeHeight) {
          desiredHeight = height;
          desiredWidth = (nativeWidth / (nativeHeight / height));
          offset.left = ((desiredWidth / 2) - width);
        } else {
          desiredWidth = width;
          desiredHeight = (nativeHeight / (nativeWidth / width));
          offset.top = ((desiredHeight / 2) - height);
        }

        ctx.drawImage(image, offset.left, offset.top, desiredWidth, desiredHeight);
        resolve(canvas.toDataURL());
      };
      image.onerror = function() {
        reject(Error("There was a problem"));
      }
      image.src = img;
    });
  };

  /**
   * @param {File} File Object
   * @return {boolean} if the upload is valid
   */
  $scope.validUpload = function(file) {
    var ext = $scope.getExtension(file.name);
    if ($scope.isImage(ext)) {
      return true;
    }
    return false;
  };

  /**
   * @param {File} File Object
   * @return {String} the extension of the file
   */
  $scope.getExtension = function(file) {
    var ext = file.split('.');
    return ext[ext.length - 1];
  };

  /**
   * @param {String} extension
   * @return {boolean} if the file extension is an image type
   */
  $scope.isImage = function(ext) {
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
    return false;
  };
}]);

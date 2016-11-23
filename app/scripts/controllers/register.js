var registerController = angular.module('registerController', []);

registerController.controller("register", ['UploadImage', 'User', '$firebaseAuth', '$scope', '$location', '$http',
 function(UploadImage, User, $firebaseAuth, $scope, $location, $http) {

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
        User.updateUsername($scope.user.username)

        // Save the users profile picture
        // Gets firebase references and picture
        var picture = $('#uploadedPicture').attr('src');

        if (picture) {
          // Uploads the file
          User.updateProfilePicture(picture, firebaseUser.uid);
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
      if (UploadImage.validUpload(file)) {
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

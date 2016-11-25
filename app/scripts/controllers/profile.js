var profileController = angular.module('profileController', []);

profileController.controller("profile", ['UploadImage', 'User', '$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function(UploadImage, User, $firebaseAuth, $firebaseObject, $scope, $location, $http) {
    $scope.user = User.getUser(); // User Object fields
    $scope.hasChangedProfile = false; // Flag to update user profile picture or not

    $scope.error = {
      message: "", //Message to be shown in form
      show: false //If true, message will be visible in form
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

    /**
     * Updates all user fields
     */
    $scope.updateUser = function() {
      $scope.changeEmail();
      $scope.changeUsername();
      if ($scope.hasChangedProfile) {
        $scope.changeProfilePicture();
        $scope.hasChangedProfile = false;
      }
    };

    $scope.changePassword = {
      newPass: '', //The newPass field value
      conPass: '' //The conPass field value
    };

    /**
     * Updates user password
     */
    $scope.changePassword = function() {
      User.updatePassword($scope.changePassword.newPass).then(function() {
        console.log("Password changed successfully!");
        document.getElementById('hidden1').style.display = "none";
        document.getElementById('passwordToggle').textContent = "Change";
        $scope.changePassword.newPass = null;
        $scope.changePassword.oldPass = null;
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    /**
     * Updates user email
     */
    $scope.changeEmail = function() {
      User.updateEmail($scope.user.email).then(function() {
        console.log("Email changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    /**
     * Updates user username
     */
    $scope.changeUsername = function() {
      User.updateUsername($scope.user.username);
    };

    /**
     * Updates user profile picture
     */
    $scope.changeProfilePicture = function() {
      var picture = $('#uploadedPicture').attr('src');
      if (picture) {
        User.updateProfilePicture(picture);
      }
    };

    $scope.getFile = function() {
      document.getElementById("upfile").click();
    };


    // Upload a profile picture
    $scope.uploadFiles = function(file) {
      $scope.f = file;
      if (file) {
        $scope.cancelError();
        // Check if image is valid
        if (UploadImage.validUpload(file)) {
          var reader = new FileReader();
          reader.onload = function(e) {

            // Set thumbnail
            $('#uploadedPicture')
              .attr('src', e.target.result)
              .width(100)
              .height(100);
            $scope.hasChangedProfile = true;
          };
          reader.readAsDataURL(file);
        } else {
          $scope.throwError('Could not upload image');
        }
      }
    };
  }
]);

// Toggle the visibility of the password form
function togglePasswordForm() {
  if (document.getElementById('hidden1').style.display == 'block') {

    document.getElementById('hidden1').style.display = "none";
    document.getElementById('passwordToggle').textContent = "Change";
  } else {
    document.getElementById('hidden1').style.display = "block";
    document.getElementById('passwordToggle').textContent = "Cancel";
  }
}

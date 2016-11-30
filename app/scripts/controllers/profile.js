var profileController = angular.module('profileController', []);

profileController.controller("profile", ['UploadImage', 'User', '$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function(UploadImage, User, $firebaseAuth, $firebaseObject, $scope, $location, $http) {
    $scope.user = User.getUser(); // User Object fields
    $scope.hasChangedProfile = false; // Flag to update user profile picture or not
    $scope.emailChangeSucceeded = null;
    $scope.usernameChangeSucceeded = null;
    $scope.profileChangeSucceeded = null;

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

      if ($scope.profile.$pristine && !$scope.hadChangedProfile) {
        $scope.successOrFailure();
      }

      if ($scope.profile.email.$dirty) {
        $scope.changeEmail();
      };

      if ($scope.profile.displayName.$dirty) {
        $scope.changeUsername();
      };

      if ($scope.hasChangedProfile) {
        $scope.changeProfilePicture();
        $scope.hasChangedProfile = false;
      };
    };


    $scope.successTextAlert = "";
    $scope.showSuccessAlert = false;
    $scope.failureTextAlert = "";
    $scope.showFailureAlert = false;
    $scope.infoTextAlert = "";
    $scope.showInfoAlert = false;

    $scope.successOrFailure = function() {
      $scope.successTextAlert = "";
      $scope.failureTextAlert = "";

      if ($scope.emailChangeSucceeded == null && $scope.usernameChangeSucceeded == null && $scope.profileChangeSucceeded == null) {
        $scope.infoTextAlert = "No fields were updated as no changes were detected";
        $scope.showInfoAlert = true;
        $scope.showSuccessAlert = false;
      }
      if ($scope.emailChangeSucceeded || $scope.usernameChangeSucceeded || $scope.profileChangeSucceeded) {
        $scope.showInfoAlert = false;
        $scope.showSuccessAlert = true;
        if ($scope.emailChangeSucceeded) {
          $scope.successTextAlert += "Email change succeeded. "
        }
        if ($scope.usernameChangeSucceeded) {
          $scope.successTextAlert += "Username change succeeded. "
        }
        if ($scope.profileChangeSucceeded) {
          $scope.successTextAlert += "Profile picture change succeded."
        }
        $scope.profile.$setPristine();
      }

      $scope.emailChangeSucceeded = null;
      $scope.usernameChangeSucceeded = null;
      $scope.profileChangeSucceeded = null;


    }



    // switch flag
    $scope.switchBool = function(value) {
      $scope[value] = !$scope[value];
    };

    $scope.password = {
      newPass: '', //The newPass field value
      conPass: '' //The conPass field value
    };

    /**
     * Updates user password
     */
    $scope.updatePassword = function() {
      User.updatePassword($scope.password.newPass).then(function() {
        console.log("Password changed successfully!");
        document.getElementById('hidden1').style.display = "none";
        document.getElementById('passwordToggle').textContent = "Change";
        $scope.password.newPass = null;
        $scope.password.oldPass = null;
        $scope.showSuccessAlert = true;
        $scope.successTextAlert = "Password changed successfully";
      }).catch(function(error) {
        console.error("Error: ", error);
        $scope.showFailureAlert = true;
        $scope.failureTextAlert = "Couldn't update password, please try again";
      });
    };

    /**
     * Updates user email
     */
    $scope.changeEmail = function() {
      User.updateEmail($scope.user.email).then(function() {
        console.log("Email changed successfully!");
        $scope.emailChangeSucceeded = true;
        $scope.successOrFailure();
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    /**
     * Updates user username
     */
    $scope.changeUsername = function() {
      User.updateUsername($scope.user.username);
      $scope.usernameChangeSucceeded = true;
      $scope.successOrFailure();
    };

    /**
     * Updates user profile picture
     */
    $scope.changeProfilePicture = function() {
      var picture = $('#uploadedPicture').attr('src');
      if (picture) {
        User.updateProfilePicture(picture).then(function(snap) {
          // Toggle the message here 
		  $scope.profileChangeSucceeded = true;
          debugger;
        }).catch(function(err) {
          console.log(err);
		  $scope.profileChangeSucceeded = false;
        });
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

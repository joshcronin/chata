var profileController = angular.module('profileController', []);

profileController.controller("profile", ['UploadImage', 'User', '$firebaseAuth', '$firebaseObject', '$scope', '$location', '$http',
  function(UploadImage, User, $firebaseAuth, $firebaseObject, $scope, $location, $http) {
    $scope.user = User.getUser();
    $scope.hasChangedProfile = false;

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

    $scope.changePassword = function() {
      User.updatePassword($scope.changePassword.newPass).then(function() {
        console.log("Password changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeEmail = function() {
      User.updateEmail($scope.user.email).then(function() {
        console.log("Email changed successfully!");
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    };

    $scope.changeUsername = function() {
      User.updateUsername($scope.user.username);
    };

    $scope.changeProfilePicture = function() {
      var picture = $('#uploadedPicture').attr('src').split(',')[1];
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
          console.log('Could not upload image');
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

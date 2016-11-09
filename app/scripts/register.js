// Define a new module for chata app. The array holds the names of dependencies if any.
// $firebaseObject, $firebaseArray, and $firebaseAuth can be injected into any controller, service, or factory.
// Pubnub Object is now avaliable
var app = angular.module("chataApp", ["firebase"]);

app.controller("registerController", function($scope, $firebaseAuth) {

  $scope.error = {
    message: "", //Message to be shown in form
    show: false //If true, message will be visible in form
  };

  $scope.user = {
    email: '', //The email field value
    password: '', //The password field value
    username: '', // The username field
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
        var picture = $('#uploadedPicture').attr('src').split(',')[1];

        if (picture) {
          // Uploads the file
          var uploadTask = imagesRef.child(firebaseUser.uid + '/profile').putString(picture, 'base64');

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
              console.log(snapshot);
            },
            function(error) {
              console.log(error);
            },
            function() {
              console.log(uploadTask.snapshot.downloadURL);
            }
          );
        }
      })
      .then(function(firebaseUser) {
        // Sign the user in
        $firebaseAuth().$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
          // Temporary before we have authenticated routes
          console.log("Signed in as:", firebaseUser.uid);
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
});

var compareTo = function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
};

app.directive("compareTo", compareTo);

var readURL = function(input) {
  if (input.files && input.files[0]) {
    if (validUpload(input.files[0])) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('#uploadedPicture')
          .attr('src', e.target.result)
          .width(100)
          .height(100);
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      alert('Could not upload image');
    }
  }
};

var validUpload = function(file) {
  var ext = getExtension(file.name);
  if (isImage(ext)) {
    return true;
  }
  return false;
};

var getExtension = function(file) {
  var ext = file.split('.');
  return ext[ext.length - 1];
};

var isImage = function(ext) {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      return true;
  }
  return false;
};

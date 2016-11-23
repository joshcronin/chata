var profileController = angular.module('profileController', []);

profileController.controller("profile", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {
	$scope.error = {
    message: "", //Message to be shown in form
    show: false //If true, message will be visible in form
  };

  $scope.changePassword = {
    newPass: '', //The newPass field value
    conPass: '' //The conPass field value
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
  
  }
]);


 // Toggle the visibility of the password form
 function togglePasswordForm() {
	 if(document.getElementById('hidden1').style.display == 'block')
    {
	
	document.getElementById('hidden1').style.display = "none";
	document.getElementById('passwordToggle').textContent = "Change";
	} 
	else {
		document.getElementById('hidden1').style.display = "block";
		document.getElementById('passwordToggle').textContent = "Cancel";
	}
	
};
var profileController = angular.module('profileController', []);

profileController.controller("profile", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {
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
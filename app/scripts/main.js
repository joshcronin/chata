// Define a new module for chata app. The array holds the names of dependencies if any.
// $firebaseObject, $firebaseArray, and $firebaseAuth can be injected into any controller, service, or factory.
// Pubnub Object is now avaliable
var app = angular.module("chataApp", ["firebase", "pubnub.angular.service"]);

app.run(['Pubnub', function (Pubnub) {
    Pubnub.init({
        publishKey: 'pub-c-81e89e4d-53aa-4a63-a79d-f5515cedec4e',
        subscribeKey: 'sub-c-8ebd3efa-9f52-11e6-aff8-0619f8945a4f'
    });
}]);

app.controller("LoginController", function($scope) {

	//Error content
	$scope.error = {
		message: "Username or password incorrect",//Message to be shown in form
		show: false//If true, message will be visible in form
	};
   
	$scope.usr_email = '';//The email field value
	$scope.usr_password = '';//The password field value

	//Method called on form submit
	$scope.submit = function() {
		console.group('Login submission');
		console.log('Username: ' + $scope.usr_email);
		console.log('Password: ' + $scope.usr_password);
		console.groupEnd();
		//If there is an error use this method
		$scope.throwError();
	};

	//Method to throw error
	$scope.throwError = function() {
		$scope.error.show = true;
	};

	//Method to throw error
	$scope.cancelError = function() {
		$scope.error.show = false;
	};

});

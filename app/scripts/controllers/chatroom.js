var chatController = angular.module('chatController', []);

chatController.controller("chat", ['$firebaseAuth', '$scope', '$location', '$http',
  function($firebaseAuth, $scope, $location, $http) {

  	//Get viewport height
	$scope.viewportHeight = window.innerHeight;

	//On route loaded
	$scope.$on('$viewContentLoaded', function(){
		var messagePanelHeight = $scope.viewportHeight;
		messagePanelHeight -= $('.navbar').outerHeight(true);//Header height
		messagePanelHeight -= $('.message-box').outerHeight(true);//Message area height
		messagePanelHeight -= 15;//Margin at the bottom

		messagePanelHeight = Math.floor(messagePanelHeight);//Round down

		$('.main-chat').height(messagePanelHeight);//Set the message panel height
	});

  }
]);

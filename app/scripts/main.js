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

(function() {
  'use strict';

  describe('LoginController', function() {
    beforeEach(module('chataApp'));

    var $controller;
    beforeEach(inject(function(_$controller_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    it('sets error to true', function() {
      var $scope = {};
      var controller = $controller('LoginController', {
        $scope: $scope
      });
      $scope.throwError();
      expect($scope.error.show).to.be.ok;
    });

    it('sets error to false', function() {
      var $scope = {};
      var controller = $controller('LoginController', {
        $scope: $scope
      });
      $scope.cancelError();
      expect($scope.error.show).to.not.be.ok;
    });

    // it('calls firebase auth with correct args', function() {
    //   var $scope = {};
    //   var controller = $controller('LoginController', {
    //     $scope: $scope,
    //     $firebaseAuth: function() {
    //       return {
    //         $signInWithEmailAndPassword: sinon.stub().returns(true)
    //       };
    //     }
    //   });
    //   $scope.usr_password = 'password';
    //   $scope.usr_email = 'user@user.com';
    //   $scope.submit();
    //   expect($firebaseAuth().$signInWithEmailAndPassword.callCount(0));
    // });
  });
})();

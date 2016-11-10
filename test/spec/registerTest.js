(function() {
  'use strict';

  describe('RegisterController', function() {
    beforeEach(module('chataApp'));

    var $controller;
    beforeEach(inject(function(_$controller_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    it('sets error to true', function() {
      var $scope = {};
      var controller = $controller('registerController', {
        $scope: $scope
      });
      $scope.throwError();
      expect($scope.error.show).to.be.ok;
    });

    it('sets error to false', function() {
      var $scope = {};
      var controller = $controller('registerController', {
        $scope: $scope
      });
      $scope.cancelError();
      expect($scope.error.show).to.not.be.ok;
    });
  });
})();

(function() {
  'use strict';

  describe('LoginController', function() {
    beforeEach(module('chataApp'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    it('it set shows error if present', function() {
      var $scope = {};
      var controller = $controller('LoginController', {
        $scope: $scope
      });
      $scope.throwError();
      expect($scope.error.show).toEqual(true);
    });
  });
})();

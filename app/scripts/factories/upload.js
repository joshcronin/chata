var uploadFactory = angular.module('uploadFactory', []);

// Factory to validate an image upload
uploadFactory.factory("UploadImage", [function() {
  return {
    /**
     * @param {File} File Object
     * @return {boolean} if the upload is valid
     */
    validUpload: function(file) {
      var ext = this.getExtension(file.name);
      if (this.isImage(ext)) {
        return true;
      }
      return false;
    },

    /**
     * @param {File} File Object
     * @return {String} the extension of the file
     */
    getExtension: function(file) {
      var ext = file.split('.');
      return ext[ext.length - 1];
    },

    /**
     * @param {String} extension
     * @return {boolean} if the file extension is an image type
     */
    isImage: function(ext) {
      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
          return true;
      }
      return false;
    },
  };
}]);

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

    resizeImage: function(img, width, height) {
      //Return a promise
      return new window.Promise(function(resolve, reject) {
        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');

        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;

        var image = new Image();
        image.onload = function() {
          //Check width and height of image
          var nativeWidth = this.width,
            nativeHeight = this.height;
          var desiredWidth = 0,
            desiredHeight = 0;
          var offset = {
            left: 0,
            top: 0
          };

          //Scale and position image in canvase
          if (nativeWidth == nativeHeight) {
            desiredHeight = height;
            desiredWidth = width;
          } else if (nativeWidth > nativeHeight) {
            desiredHeight = height;
            desiredWidth = (nativeWidth / (nativeHeight / height));
            offset.left = -((desiredWidth - width) / 2);
          } else {
            desiredWidth = width;
            desiredHeight = (nativeHeight / (nativeWidth / width));
            offset.top = -((desiredHeight - height) / 2);
          }

          ctx.drawImage(image, offset.left, offset.top, desiredWidth, desiredHeight);
          resolve(canvas.toDataURL());
        };
        image.onerror = function(e) {
          reject(Error("There was a problem"));
        };
        image.src = img;
      });
    }
  };
}]);

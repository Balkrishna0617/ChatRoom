angular.module('Services',[])
.service('sendImageService', function ($http, $rootScope) {
	this.sendImage = function (file) {
		// console.log("file fount in service : ", file);
		// return $http({
		// 	method: 'POST',
		// 	// data: imageData,
		// 	// file: file,
		// 	url: $rootScope.baseUrl + '/uploadImage',
		// 	// headers: $rootScope.headerData
		// 	// headers : {
  //  //              'Content-Type': file.type
  //  //          },
  //  //          data: file
		// });
		 return $http.post( $rootScope.baseUrl + '/uploadImage', file, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                return response;
            });

	};

});
angular.module('Services',[])
.service('sendImageService', function ($http, $rootScope) {
	this.sendImage = function (file) {
		 return $http.post( $rootScope.baseUrl + '/uploadImage', file, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                return response;
            });

	};

});
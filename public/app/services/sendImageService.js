angular.module('Services',[])
.service('sendImageService', function ($http, $rootScope) {
	this.sendImage = function (imageData) {
		return $http({
			method: 'POST',
			data: imageData,
			url: $rootScope.baseUrl + '/uploadImage'
			// headers: $rootScope.headerData
		});
	};

});
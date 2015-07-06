var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers'])
.run(["$rootScope", function ($rootScope){
	$rootScope.baseUrl = 'http://158.69.96.25:3000';
}]);
App.config(function ($routeProvider, $socketProvider){
	// $socketProvider.setConnectionUrl('http://localhost:3000');
	$socketProvider.setConnectionUrl('http://158.69.96.25:3000');

	$routeProvider
	.when('/', {
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl'
	})
	.when('/ChatRoom', {
		templateUrl: 'app/views/chatRoom.html',
		controller: 'chatRoomCtrl'
	});
});

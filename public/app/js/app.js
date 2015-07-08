var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers','Services'])
.run(["$rootScope", function ($rootScope){
	$rootScope.baseUrl = 'http://192.168.2.135:3000';
}]);
App.config(function ($routeProvider, $socketProvider){
	// $socketProvider.setConnectionUrl('http://localhost:3000');
	$socketProvider.setConnectionUrl('http://192.168.2.135:3000');

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

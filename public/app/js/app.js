var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers','Services'])
.run(["$rootScope", function ($rootScope){
	$rootScope.baseUrl = 'http://192.168.2.135:8282';
}]);
App.config(function ($routeProvider, $socketProvider){
	$socketProvider.setConnectionUrl('http://192.168.2.135:8282');

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

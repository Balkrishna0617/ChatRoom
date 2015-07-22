angular.module('Controllers',[])
.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
            if(value === true) { 
              console.log('value=',value);
              $timeout(function() {
                element[0].focus();
                scope[attrs.focusMe] = false;
              });
            }
          });
        }
    };
})
.controller('loginCtrl', function ($scope, $location, $rootScope, $socket){
	// Varialbles Initialization.
	$scope.userAvatar = "Avatar1.jpg";
	$scope.isErrorReq = false;
	$scope.isErrorNick = false;
	$scope.username = "";

	// redirection if user logged in.
	if($rootScope.loggedIn){
		$location.path('/ChatRoom');
	}

	// Functions for controlling behaviour.
	$scope.redirect = function(){
		console.log($scope.username.length);
		if ($scope.username.length <= 20) {
			if($scope.username){
				$socket.emit('new user',{username : $scope.username, userAvatar : $scope.userAvatar},function(data){
					if(data.success == true){
						$rootScope.username = $scope.username;
						$rootScope.userAvatar = $scope.userAvatar;
						$rootScope.loggedIn = true;
						$location.path('/ChatRoom');					
					}else{
						$scope.errMsg = "Use different nickname.";
						$scope.isErrorNick = true;
						$scope.isErrorReq = true;
						$scope.printErr($scope.errMsg);	
					}			
				});
			}else{
				$scope.errMsg = "Enter a nickname.";
				$scope.isErrorReq = true;
				$scope.printErr($scope.errMsg);
			}
		}else{
			$scope.errMsg = "Nickname exceed 20 charachters.";
			$scope.isErrorNick = true;
			$scope.isErrorReq = true;
			$scope.printErr($scope.errMsg);
		}
	}

	$scope.printErr = function(msg){
		var html = '<p id="alert">'+ msg +'</p>';
		if ($( ".chat-box" ).has( "p" ).length < 1) {
			$(html).hide().prependTo(".chat-box").fadeIn(1500);
			$('#alert').delay(1000).fadeOut('slow', function(){
				$('#alert').remove();
			});
		};
	}
	$scope.changeAvatar = function(avatar){
			$scope.userAvatar = avatar;
	}
})

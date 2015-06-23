angular.module('Controllers',[])
.controller('loginCtrl', function ($scope, $location, $localStorage, $socket){
	// Varialbles Initialization.
	$scope.userAvatar = "Avatar1";
	$scope.isErrorReq = false;
	$scope.isErrorNick = false;
	// $localStorage.loggedIn = false;

	// redirection if user logged in.
	if($localStorage.loggedIn){
		$location.path('/ChatRoom');
	}


	// Functions for controlling behaviour.
	$scope.redirect = function(){
		if($scope.username){
		console.log("i'm called. : ", $scope.username);
		console.log("Avatar selected : ", $scope.userAvatar);
			$socket.emit('new user',{username : $scope.username, userAvatar : $scope.userAvatar},function(data){
				console.log("socket event fired");
				if(data.success == true){
					$localStorage.loggedIn = true;
					$location.path('/ChatRoom');					
				}else{
					$scope.isErrorNick = true;
					$scope.isErrorReq = true;	
				}			
			});

			// if($scope.username === 'Ankit'){
			// 	$scope.isErrorNick = true;
			// 	$scope.isErrorReq = true;
			// }else{

			// 	$localStorage.loggedIn = true;
			// 	$location.path('/ChatRoom');
			// }
		}else{
			$scope.errMsg = "Enter nickname.";
			$scope.isErrorReq = true;
			console.log($scope.errMsg);
		}
	}

	$scope.changeAvatar = function(avatar){
			$scope.userAvatar = avatar;
			console.log('Avatar selected : ', $scope.userAvatar);			
	}
})
	// $scope.errMsg = "Enter Nickname to get started...";
	// if ($localStorage.nickName){
	// 	$location.path('/property');
	// }
				
	// $scope.checkNick = function(){
	// 	// console.log("inside checkNick ", $scope.nickname);
	// 	var json = {
	// 		nickName : $scope.nickname
	// 	}
	// 	nickNameService.getNick(json).then(function (response){
	// 		// console.log(response.data);
	// 		if (response.data.success === true ){
	// 			$scope.errMsg = "";
	// 			$localStorage.nickName = $scope.nickname;
	// 			$location.path('/property');
	// 		} else{
	// 			$scope.errMsg = "Nickname is already in use, please try different Nickname.";
	// 		}	
	// 	},
	// 	function (error){
	// 		console.log("Error on Nick Controller Page : ", error);
	// 	});
	// }

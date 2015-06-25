angular.module('Controllers')
.controller('chatRoomCtrl', function ($scope, $rootScope, $socket){
	// Varialbles Initialization.
	$scope.isMsgBoxEmpty = false;
	$scope.isFileSelected = false;
	$scope.users = [
		{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"},
		{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"},
		{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"}				
	];

	$scope.messeges = [
		{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg", ownMsg : true, msg : "This is messege from Ankit"},
		{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg", ownMsg : false, msg : "This is messege from Madhuri"},
		{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg", ownMsg : true, msg : "This is messege from Ankit"},
	];

	console.log("$rootScope.username", $rootScope.username);			
	console.log("$rootScope.userAvatar", $rootScope.userAvatar);
	//Messege Box Validations
	if ( $scope.isMsgBoxEmpty || $scope.isFileSelect) {
		console.log("user has entered something");
	}else{
		console.log("user has not entered anything");
	}

	//Socket Handling of Online members.
	$socket.on("online-members", function(data){
			$scope.users = data.online-membs;
	});

	$socket.on("new message", function(data){
		if(data.username == $rootScope.username){
			data.ownMsg = true;	
		}else{
			data.ownMsg = false;
		}
		$scope.messeges.push(data);
	});
	$scope.sendMsg = function(){
		$socket.emit("send-message",{ username : $rootScope.username, userAvatar : $rootScope.userAvatar, msg : $scope.chatMsg, msgTime : "23 Jan 5:37 pm" }, function(data){
			//delivery report code goes here
		});
	}





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
})
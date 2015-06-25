angular.module('Controllers')
.controller('chatRoomCtrl', function ($scope, $socket){
	// Varialbles Initialization.
	$scope.isMsgBoxEmpty = false;
	$scope.isFileSelected = false;
	$scope.moreUsers = true;
	$scope.users = [
		{ username : "Ankit Sawant", userAvatar : "user1-128x128.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "user8-128x128.jpg"},
		{ username : "Ankit Sawant", userAvatar : "user1-128x128.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "user8-128x128.jpg"},
		{ username : "Ankit Sawant", userAvatar : "user1-128x128.jpg"},
		{ username : "Madhuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Mayuri Jadhav", userAvatar : "user3-128x128.jpg"},
		{ username : "Manoj Jadhav", userAvatar : "user8-128x128.jpg"}				
	];

	$scope.messeges = [
		{ username : "Ankit Sawant", userAvatar : "user1-128x128.jpg", ownMsg : true, msg : "This is messege from Ankit"},
		{ username : "Madhuri Jadhav", userAvatar : "user3-128x128.jpg", ownMsg : false, msg : "This is messege from Madhuri"},
		{ username : "Ankit Sawant", userAvatar : "user1-128x128.jpg", ownMsg : true, msg : "This is messege from Ankit"},
	];
	//Messege Box Validations
	if ( $scope.isMsgBoxEmpty || $scope.isFileSelect) {
		console.log("user has entered something");
	}else{
		console.log("user has not entered anything");
	}

	//Socket Handling of Online members.
	$socket.on("online-members", function(data){
		if(data.more-users == true){
			$scope.users = data.online-membs;
			$scope.moreUsers = data.more-users;
		}else{
			$scope.moreUsers = data.more-users;
			$scope.noUsers = "No users online.";
		}
	});
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
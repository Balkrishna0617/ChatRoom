angular.module('Controllers')
.directive('schrollBottom', function () {
  return {
    scope: {
      schrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.controller('chatRoomCtrl', function ($scope, $rootScope, $socket, $location){
	// Varialbles Initialization.
	$scope.isMsgBoxEmpty = false;
	$scope.isFileSelected = false;
	$scope.chatMsg = "";
	$scope.users = [];
	// $scope.users = [
	// 	{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
	// 	{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"},
	// 	{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
	// 	{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"},
	// 	{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg"},
	// 	{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Mayuri Jadhav", userAvatar : "Avatar3.jpg"},
	// 	{ username : "Manoj Jadhav", userAvatar : "Avatar8.jpg"}				
	// ];
	$scope.messeges = [];
	// $scope.messeges = [
	// 	{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg", ownMsg : true, msg : "This is messege from Ankit"},
	// 	{ username : "Madhuri Jadhav", userAvatar : "Avatar3.jpg", ownMsg : false, msg : "This is messege from Madhuri"},
	// 	{ username : "Ankit Sawant", userAvatar : "Avatar1.jpg", ownMsg : true, msg : "This is messege from Ankit"},
	// ];

	console.log("$rootScope.username", $rootScope.username);			
	console.log("$rootScope.userAvatar", $rootScope.userAvatar);
	console.log("$rootScope.loggedIn", $rootScope.loggedIn);
	
	// redirection if user is not logged in.
	if(!$rootScope.loggedIn){
		$location.path('/');
	}


	//Messege Box Validations
	// if ( $scope.isMsgBoxEmpty || $scope.isFileSelect) {
	// 	console.log("user has entered something");
	// }else{
	// 	console.log("user has not entered anything");
	// }
	$socket.on('abc', function(data){
		console.log(data);
	});
	$socket.emit('get-online-members',function(data){

	});
	//Socket Handling of Online members.
	$socket.on("online-members", function(data){
			
			$scope.users = data;
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
		// console.log("inside sendMsg()");
		// console.log("$scope.chatMsg *"+ $scope.chatMsg +"*");
		if ($scope.chatMsg) {
			var dateString = formatAMPM(new Date());
			$socket.emit("send-message",{ username : $rootScope.username, userAvatar : $rootScope.userAvatar, msg : $scope.chatMsg, msgTime : dateString }, function(data){
				//delivery report code goes here
				if (data.success == true) {
					$scope.chatMsg = "";
					console.log("Messege has deliverd successfully");
				}else{
					console.log("Message not sent.");
				}
			});
		}else{
			$scope.isMsgBoxEmpty = true;
		}
		
	}

	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
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
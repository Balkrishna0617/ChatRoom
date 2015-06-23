angular.module('Controllers')
.controller('chatRoomCtrl', function ( $scope){

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
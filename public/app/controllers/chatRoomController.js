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
.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
            if(value === true) { 
              // console.log('value=',value);
              $timeout(function() {
                element[0].focus();
                scope[attrs.focusMe] = false;
              });
            }
          });
        }
    };
})
.controller('chatRoomCtrl', function ($scope, $rootScope, $socket, $location, $http, Upload, $timeout, sendImageService){
	// Varialbles Initialization.
	$scope.isMsgBoxEmpty = false;
	$scope.isFileSelected = false;
	$scope.isMsg = false;
	$scope.setFocus = true;
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

	// console.log("$rootScope.username", $rootScope.username);			
	// console.log("$rootScope.userAvatar", $rootScope.userAvatar);
	// console.log("$rootScope.loggedIn", $rootScope.loggedIn);
	
	// redirection if user is not logged in.
	if(!$rootScope.loggedIn){
		$location.path('/');
	}


// ================================== Online Members List ===============================
	$socket.emit('get-online-members',function(data){
	});
	$socket.on("online-members", function(data){			
			$scope.users = data;
	});



// ================================== Common Functions ==================================    
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
 	$scope.custom = true;
    $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true: false;

        	
        if($scope.custom){

        	// angular.element(document.querySelector("#abc")).removeClass("fade-show");
        	// angular.element(document.querySelector("#abc")).addClass("fade-hide");
        	angular.element(document.querySelector("#slidememberlist")).removeClass("slideIn");	
        	angular.element(document.querySelector("#slidememberlist")).addClass("slideOut");
        }else{
        	// angular.element(document.querySelector("#abc")).removeClass("fade-hide");
        	// angular.element(document.querySelector("#abc")).addClass("fade-show");
        	angular.element(document.querySelector("#slidememberlist")).removeClass("slideOut");
        	angular.element(document.querySelector("#slidememberlist")).addClass("slideIn");
        }
        
    };
    

// ====================================== Messege Sending Code ============================
	
	$scope.sendMsg = function(){
		if ($scope.chatMsg) {
			$scope.isFileSelected = false;
			$scope.isMsg = true;
			var dateString = formatAMPM(new Date());
			$socket.emit("send-message",{ username : $rootScope.username, userAvatar : $rootScope.userAvatar, msg : $scope.chatMsg, hasMsg : $scope.isMsg , hasFile : $scope.isFileSelected , msgTime : dateString }, function(data){
				//delivery report code goes here
				if (data.success == true) {
					$scope.chatMsg = "";
					$scope.setFocus = true;
					// console.log("Messege has deliverd successfully");
				}else{
					// console.log("Message not sent.");
				}
			});
		}else{
			$scope.isMsgBoxEmpty = true;
		}
		
	}

	$socket.on("new message", function(data){
		if(data.username == $rootScope.username){
			data.ownMsg = true;	
		}else{
			data.ownMsg = false;
		}
		$scope.messeges.push(data);
	});

// ====================================== Image Sending Code ==============================
    $scope.$watch('imageFiles', function () {
        $scope.sendImage($scope.imageFiles);
    });
    $scope.openClickImage = function(msg){
		if(!msg.ownMsg){
		msg.showme = false;
		msg.imgsrc = msg.serverimg;
		// console.log(msg);
		// window.open('http://192.168.2.135:3000/app/images/IJCSIT-paper_angularjs.doc');
		// window.open("http://192.168.2.135:3000/app/images/demo.jpg");
		}
    };
    $socket.on("new message image", function(data){
		$scope.showme = true;
		if(data.username == $rootScope.username){
			data.ownMsg = true;	
			data.dwimgsrc = "app/images/spin.gif";	
		}else{
			data.ownMsg = false;
		}
		if((data.username == $rootScope.username) && data.repeatMsg){
			checkMessegesImage(data);
		}else{
			$scope.messeges.push(data);
		}
	});
	function checkMessegesImage(msg){
		for (var i = ($scope.messeges.length-1); i >= 0 ; i--) {
			if($scope.messeges[i].hasFile){
				if ($scope.messeges[i].istype === "image") {
					if($scope.messeges[i].dwid === msg.dwid){
						$scope.messeges[i].showme = false;
						$scope.messeges[i].imgsrc = msg.serverimg;
						break;	
					}
				}						
			}
		};
	}
    $scope.sendImage = function (files) {
        if (files && files.length) {
        	$scope.isFileSelected = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var dateString = formatAMPM(new Date());            
                var DWid = $rootScope.username + "dwid" + Date.now();
                var image = {
			      		username : $rootScope.username, 
			      		userAvatar : $rootScope.userAvatar, 
			      		hasFile : $scope.isFileSelected , 
			      		isImageFile : true, 
			      		istype : "image", 
			      		showme : true , 
			      		dwimgsrc : "app/images/gallery_icon1.png", 
			      		dwid : DWid, 
			      		msgTime : dateString			      		
			    };
                $socket.emit('send-message',image,function (data){           
                });
               	var imageData;
               	var fr = new FileReader();
			    if (FileReader && files && files.length) {					   
			      fr.readAsDataURL(files[0]);
			      fr.onload = function () {
			        imageData = fr.result;
			      	imageData = imageData.toString();
			      	image.filecontent = imageData; 
			      	image.filename = file.name;			      	
			      	$http.post($rootScope.baseUrl + "/uploadImage",image, function (res){
	                });	
			      };
				}
            }
        }
    };
    
    // $scope.sendAudio = function (files) {
    //     if (files && files.length) {
    //     	$scope.isFileSelected = true;
    //         for (var i = 0; i < files.length; i++) {
    //             var file = files[i];
    //             var dateString = formatAMPM(new Date());
    //             console.log("file sending...");
    //             $socket.emit('send-message',{ username : $rootScope.username, userAvatar : $rootScope.userAvatar, hasFile : $scope.isFileSelected , isMusicFile : true, istype : "music", msgTime : dateString },function (data){
    //             	// console.log("inside console",data);
    //             });
    //             var audioData;
    //             var fr = new FileReader();
			 //    if (FileReader && files && files.length) {
				// 	console.log("im inside");	      
			 //      fr.readAsDataURL(files[0]);
			 //      fr.onload = function () {
			 //        audioData = fr.result;
			 //      	console.log("im here inside sendImage : ", audioData);
			 //      	$http.post($rootScope.baseUrl + "/uploadAudio",{ filecontent : audioData, filename : file.name}, function (res){
	   //              	console.log(res);
	   //              });	
			 //      };
				// }

                
    //         }
    //     }
    // };
    // $scope.sendDoc = function (files) {
    //     if (files && files.length) {
    //     	$scope.isFileSelected = true;
    //         for (var i = 0; i < files.length; i++) {
    //             var file = files[i];
    //             var dateString = formatAMPM(new Date());
    //             console.log("file sending...");
    //             $socket.emit('send-message',{ username : $rootScope.username, userAvatar : $rootScope.userAvatar, hasFile : $scope.isFileSelected , sendfile : file, istype : "doc", msgTime : dateString },function (data){
    //             	// console.log("inside console",data);
    //             });
    //         }
    //     }
    // };

// =========================================== Audio Sending Code =====================
    $scope.$watch('musicFiles', function () {
        $scope.sendAudio($scope.musicFiles);
    });
    $scope.openClickMusic = function(msg){
		window.open('http://192.168.2.135:3000/'+msg.musicFileName);
	}
    $socket.on("new message music", function(data){
		if(data.username == $rootScope.username){
			data.ownMsg = true;
			data.dwimgsrc = "app/images/spin.gif";
		}else{
			data.ownMsg = false;
		}
		if((data.username == $rootScope.username) && data.repeatMsg){	
			checkMessegesMusic(data);
		}else{
			$scope.messeges.push(data);
			// console.log("Inside Username ", data);
		}
	});
	function checkMessegesMusic(msg){
		console.log(" checkMessegesMusic : ",msg);
		for (var i = ($scope.messeges.length-1); i >= 0 ; i--) {
			if($scope.messeges[i].hasFile){
				if ($scope.messeges[i].istype === "music") {					
					if($scope.messeges[i].dwid === msg.dwid){
						$scope.messeges[i].showme = true;
						$scope.messeges[i].musicFileName = msg.musicFileName;
						$scope.messeges[i].filename = msg.filename;
						$scope.messeges[i].size = msg.size;
						$scope.messeges[i].dwimgsrc = "app/images/music_icon1.png";
						break;	
					}
				}						
			}
		};
	}    
    $scope.sendAudio = function (files) {
        if (files && files.length) {
        	$scope.isFileSelected = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var dateString = formatAMPM(new Date());
                var DWid = $rootScope.username + "dwid" + Date.now();
                var audio = {
                		username : $rootScope.username, 
			      		userAvatar : $rootScope.userAvatar, 
			      		hasFile : $scope.isFileSelected ,
			      		isMusicFile : true,
                		istype : "music",
                		showme : false,
                		dwimgsrc : "app/images/music_icon1.png", 
			      		dwid : DWid, 
                		msgTime : dateString
                }		

                $socket.emit('send-message',audio,function (data){
                });
                var audioData;
                var fr = new FileReader();
			    if (FileReader && files && files.length) {      
			      fr.readAsDataURL(files[0]);
			      fr.onload = function () {
			        audioData = fr.result;
			        audio.filecontent = audioData;
			        audio.filename = file.name;
			      	// console.log("im here inside sendImage : ", audioData);
			      	$http.post($rootScope.baseUrl + "/uploadAudio",audio, function (res){
	                });	
			      };
				}                
            }
        }
    };

//==================================== Doc Sending Code ==============================
    $scope.$watch('PDFFiles', function () {
        $scope.sendPDF($scope.PDFFiles);
    });
    $scope.openClickPDF = function(msg){
    	console.log(msg)
		window.open('http://192.168.2.135:3000/'+msg.PDFFileName);
	}
	$socket.on("new message PDF", function(data){
		if(data.username == $rootScope.username){
			data.ownMsg = true;
			data.dwimgsrc = "app/images/spin.gif";
		}else{
			data.ownMsg = false;
		}
		if((data.username == $rootScope.username) && data.repeatMsg){	
			// console.log("checkMessegesDocPDF Inside", data);
			checkMessegesPDF(data);
		}else{
			$scope.messeges.push(data);
			// console.log("Inside Username ", data);
		}
	});
	function checkMessegesPDF(msg){
		// console.log(" checkMessegesDoc : ",msg);
		for (var i = ($scope.messeges.length-1); i >= 0 ; i--) {
			if($scope.messeges[i].hasFile){
				if ($scope.messeges[i].istype === "PDF") {					
					if($scope.messeges[i].dwid === msg.dwid){
						$scope.messeges[i].showme = true;
						$scope.messeges[i].PDFFileName = msg.PDFFileName;
						$scope.messeges[i].filename = msg.filename;
						$scope.messeges[i].size = msg.size;
						$scope.messeges[i].dwimgsrc = "app/images/doc_icon.png";
						break;	
					}
				}						
			}
		};
	}
    $scope.sendPDF = function (files) {
        if (files && files.length) {
        	$scope.isFileSelected = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var dateString = formatAMPM(new Date());
                var DWid = $rootScope.username + "dwid" + Date.now();
                var PDF = {
                		username : $rootScope.username, 
			      		userAvatar : $rootScope.userAvatar, 
			      		hasFile : $scope.isFileSelected ,
			      		isPDFFile : true,
                		istype : "PDF",
                		showme : false,
                		dwimgsrc : "app/images/doc_icon.png", 
			      		dwid : DWid, 
                		msgTime : dateString
                }
                $socket.emit('send-message',PDF,function (data){
                });
                var PDFData;
                var fr = new FileReader();
			    if (FileReader && files && files.length) {      
			      fr.readAsDataURL(files[0]);
			      fr.onload = function () {
			        PDFData = fr.result;
			        PDF.filecontent = PDFData;
			        PDF.filename = file.name;
			      	// console.log("im here inside sendImage : ", audioData);
			      	$http.post($rootScope.baseUrl + "/uploadPDF",PDF, function (res){
	                });	
			      };
				}
            }
        }
    };




 //    $scope.inputImageFile = function(files) {
 //    	var fd = new FormData();
	//     //Take the first selected file
	//     fd.append("file", files[0]);
	//  //    var buffer = new ArrayBuffer(files.size);
	// 	// var view   = new Int32Array(buffer);
	//     console.log("im here", files[0]);
	//     var fr = new FileReader();
	//     if (FileReader && files && files.length) {
	// 		console.log("im inside");	      
	//       fr.readAsDataURL(files[0]);
	//       fr.onload = function () {
	//          var imageData = fr.result;
	//       		console.log("im here", imageData);
	//       };

	// 	}	    

	// };
	    
})
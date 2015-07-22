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
	$scope.messeges = [];
	
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
        if(!$scope.custom){
        	if(!angular.element(document.querySelector("#slidememberlist")).hasClass("slideout_inner_trans")){
        		angular.element(document.querySelector("#slidememberlist")).addClass("slideout_inner_trans");
        	}
        }else{
        	if (angular.element(document.querySelector("#slidememberlist")).hasClass("slideout_inner_trans")) {
        		angular.element(document.querySelector("#slidememberlist")).removeClass("slideout_inner_trans");        		
        	}
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
		$http.post($rootScope.baseUrl + "/getfile",msg).success(function (response){
	    	if(!response.isExpired){
	    		msg.showme = false;
				msg.imgsrc = msg.serverfilename;		
	    	}else{
	    		var html = '<p id="alert">'+ response.expmsg +'</p>';
				$(html).hide().prependTo(".chat-box").fadeIn(1500);
				$('#alert').delay(2000).fadeOut('slow', function(){
					$('#alert').remove();
				});
	    	}
	    });	
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
						$scope.messeges[i].filename = msg.filename;
						$scope.messeges[i].imgsrc = msg.serverfilename;
						break;	
					}
				}						
			}
		};
	}
	$scope.validateImage = function(file){
		var filetype = file.type.substring(0,file.type.indexOf('/'));
		// console.log(filetype);
		if (filetype == "image") {
			return true;
		}else{
			var html = '<p id="alert">Select Images.</p>';
			$(html).hide().prependTo(".chat-box").fadeIn(1500);
			$('#alert').delay(2000).fadeOut('slow', function(){
				$('#alert').remove();
			});
			return false;
		}
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

// =========================================== Audio Sending Code =====================
    $scope.$watch('musicFiles', function () {
        $scope.sendAudio($scope.musicFiles);
    });
    $scope.openClickMusic = function(msg){
    	$http.post($rootScope.baseUrl + "/getfile",msg).success(function (response){
	    	if(!response.isExpired){
	    		window.open('http://192.168.2.135:8282/'+response.serverfilename, "_blank");
	    	}else{
	    		var html = '<p id="alert">'+ response.expmsg +'</p>';
				$(html).hide().prependTo(".chat-box").fadeIn(1500);
				$('#alert').delay(2000).fadeOut('slow', function(){
					$('#alert').remove();
				});
	    	}
	    });	
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
		}
	});
	function checkMessegesMusic(msg){
		console.log(" checkMessegesMusic : ",msg);
		for (var i = ($scope.messeges.length-1); i >= 0 ; i--) {
			if($scope.messeges[i].hasFile){
				if ($scope.messeges[i].istype === "music") {					
					if($scope.messeges[i].dwid === msg.dwid){
						$scope.messeges[i].showme = true;
						$scope.messeges[i].serverfilename = msg.serverfilename;
						$scope.messeges[i].filename = msg.filename;
						$scope.messeges[i].size = msg.size;
						$scope.messeges[i].dwimgsrc = "app/images/music_icon1.png";
						break;	
					}
				}						
			}
		};
	}
	$scope.validateMP3 = function(file){
		console.log(file);
		if (file.type == "audio/mp3" || file.type == "audio/mpeg") {
			return true;
		}else{
			var html = '<p id="alert">Select MP3.</p>';
			$(html).hide().prependTo(".chat-box").fadeIn(1500);
			$('#alert').delay(2000).fadeOut('slow', function(){
				$('#alert').remove();
			});
			return false;
		}
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
			      	$http.post($rootScope.baseUrl + "/uploadAudio",audio, function (res){
	                });	
			      };
				}                
            }
        }
    };

//==================================== Doc Sending Code ==============================
    $scope.$watch('PDFFiles', function () {
    	var file = $scope.PDFFiles;
        $scope.sendPDF($scope.PDFFiles);
    });
    $scope.openClickPDF = function(msg){
    	$http.post($rootScope.baseUrl + "/getfile",msg).success(function (response){
	    	if(!response.isExpired){
	    		window.open('http://192.168.2.135:8282/'+response.serverfilename, "_blank");
	    	}else{
	    		var html = '<p id="alert">'+ response.expmsg +'</p>';
				$(html).hide().prependTo(".chat-box").fadeIn(1500);
				$('#alert').delay(2000).fadeOut('slow', function(){
					$('#alert').remove();
				});
	    	}
	    });
  //   	$http.post($rootScope.baseUrl + "/getfile",msg, function (res){
	 //    	console.log(res);
	 //    });	
		// window.open('http://192.168.2.135:8282/'+msg.serverfilename, "_blank");
	}
	$socket.on("new message PDF", function(data){
		if(data.username == $rootScope.username){
			data.ownMsg = true;
			data.dwimgsrc = "app/images/spin.gif";
		}else{
			data.ownMsg = false;
		}
		if((data.username == $rootScope.username) && data.repeatMsg){	
			checkMessegesPDF(data);
		}else{
			$scope.messeges.push(data);
		}
	});
	function checkMessegesPDF(msg){
		for (var i = ($scope.messeges.length-1); i >= 0 ; i--) {
			if($scope.messeges[i].hasFile){
				if ($scope.messeges[i].istype === "PDF") {					
					if($scope.messeges[i].dwid === msg.dwid){
						$scope.messeges[i].showme = true;
						$scope.messeges[i].serverfilename = msg.serverfilename;
						$scope.messeges[i].filename = msg.filename;
						$scope.messeges[i].size = msg.size;
						$scope.messeges[i].dwimgsrc = "app/images/doc_icon.png";
						break;	
					}
				}						
			}
		};
	}
	$scope.validatePDF = function(file){
		console.log("file type : ", file.type);
		// var filetype = file.type.substring(0,file.type.indexOf('/'));
		if (file.type == "application/pdf" || file.type == "application/msword" || file.type == "application/vnd.ms-excel") {
			return true;
		}else{
			var html = '<p id="alert">Select pdf/excel/doc.</p>';
			$(html).hide().prependTo(".chat-box").fadeIn(1500);
			$('#alert').delay(2000).fadeOut('slow', function(){
				$('#alert').remove();
			});
			return false;
		}
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
			      	$http.post($rootScope.baseUrl + "/uploadPDF",PDF, function (res){
	                });	
			      };
				}
            }
        }
    };	    
})
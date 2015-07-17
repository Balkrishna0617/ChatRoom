// var express = require('express');
// var app = express();
// var http = require('http');
// var bodyParser = require('body-parser');
// var fs = require('fs');
// var multer = require('multer');
// var server = http.createServer(app);
// var io = require('socket.io');
// var ios = io.listen(server);
// var nickname = [];
// var i = [];
// var x = [];
// var online_member = [];
// var temp1;
// var socket_id;
// var socket_data;

// server.listen(3000,'192.168.2.135');

// app.use(bodyParser.json({ 
//     limit: 1024 * 10000
// }));
// app.use(bodyParser.text({ 
//     limit: 1024 * 10000
// }));
// app.use(bodyParser.raw({ 
//     limit: 1024 * 10000
// }));
// app.use(bodyParser.urlencoded({
//         extended: true
// }));
// app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/public/app/upload/images'));
// app.use(express.static(__dirname + '/public/app/upload/music'));
// app.use(express.static(__dirname + '/public/app/upload/doc'));
// app.use(function(req, res, next) {														// CORS Issue Fix
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// ios.on('connection', function(socket){	

// 	socket.on('new user', function(data, callback){
// 		if(nickname[data.username])
// 			{
// 				callback({success:false});
// 			}else{
// 				callback({success:true});
// 				socket.username = data.username;
// 				socket.userAvatar = data.userAvatar;
// 				nickname[data.username] = socket;
// 			}
// 	});

// 	socket.on('get-online-members', function(data){
// 		var online_member = [];
// 		i = Object.keys(nickname);
// 		for(var j=0;j<i.length;j++ )
// 		{
// 			socket_id = i[j];
// 			socket_data = nickname[socket_id];
// 			temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
// 			online_member.push(temp1);
// 		}
// 		ios.sockets.emit('online-members', online_member);		
// 	});

// 	socket.on('send-message', function(data, callback){
// 		if(data.hasMsg){
// 			ios.sockets.emit('new message', data);
// 			callback({success:true});	
// 		}else if(data.hasFile){
// 			if(data.istype == "image"){
// 				// console.log("recieved file");
// 				// data.sendfile = "";
// 				socket.emit('new message image', data);
// 				// var base64file = base64ArrayBuffer(data.sendfile);
// 				// console.log("sending file");
// 				// data.sendfile = base64file;

				
// 				callback({success:true});
// 			} else if(data.istype == "music"){
// 				socket.emit('new message music', data);
// 				callback({success:true});
// 			} else if(data.istype == "PDF"){
// 				socket.emit('new message PDF', data);
// 				callback({success:true});
// 			}
// 		}else{
// 			callback({ success:false});
// 		}
		
// 	});

// 	socket.on('send-image', function(data, callback){
// 		console.log(data);
// 		callback("upload messege from server");	
// 	});

// 	socket.on('disconnect', function () {	
// 		console.log('one client disconnected');

// 		delete nickname[socket.username];
// 		online_member = [];
// 		x = Object.keys(nickname);
// 		for(var k=0;k<x.length;k++ )
//     	{
//         	socket_id = x[k];
//         	socket_data = nickname[socket_id];
//         	temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
//             online_member.push(temp1);
//     	}
// 		ios.sockets.emit('online-members', online_member);            	
//    	});
// });

// app.post('/uploadImage',function (req, res){
// 	// console.log(req.body);
// 	var userName = req.body.username;
// 	var useravatar = req.body.userAvatar;
// 	var hasfile = req.body.hasFile;
// 	var isimagefile = req.body.isImageFile;
// 	var isType = req.body.istype;
// 	var showMe = req.body.dwimgsrc;
// 	var DWimgsrc = req.body.dwimgsrc;
// 	var DWid = req.body.dwid;
// 	var msgtime = req.body.msgTime;
// 	var filename = Date.now() + req.body.filename;
// 	var filecontent = req.body.filecontent;
// 	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
// 	// console.log(filecontent);
	
// 	fs.writeFile("./public/app/upload/images/"+filename, filecontent, function(){
// 		var data = { 
// 			username : userName, 
// 			userAvatar : useravatar, 
// 			repeatMsg : true, 
// 			hasFile : hasfile, 
// 			isImageFile : isimagefile, 
// 			istype : isType, 
// 			showme : showMe, 
// 			dwimgsrc : DWimgsrc, 
// 			dwid : DWid, 
// 			msgTime : msgtime, 
// 			serverimg : "app/images/demo.jpg",
// 			filename : req.body.filename,
// 			size : '579kbs'
// 		};
// 	ios.sockets.emit('new message image', data);
// 	console.log("done writting");
// 	res.send({"success" : "res from server"});
// 	});
// });
// // ios.sockets.emit('new message music', data);

// app.post('/uploadAudio',function (req, res){
// 	var userName = req.body.username;
// 	var useravatar = req.body.userAvatar;
// 	var hasfile = req.body.hasFile;
// 	var ismusicfile = req.body.isMusicFile;
// 	var isType = req.body.istype;
// 	var showMe = req.body.showme;
// 	var DWimgsrc = req.body.dwimgsrc;
// 	var DWid = req.body.dwid;
// 	var msgtime = req.body.msgTime;
// 	var filename = Date.now() + req.body.filename;
// 	var filecontent = req.body.filecontent;
// 	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
// 	// console.log(filecontent);
	
// 	fs.writeFile("./public/app/upload/music/"+filename, filecontent, function(){
// 		// console.log("dwimgsrc", DWimgsrc);
// 		var data = { 
// 			username : userName, 
// 			userAvatar : useravatar, 
// 			repeatMsg : true, 
// 			hasFile : hasfile, 
// 			isMusicFile : ismusicfile, 
// 			istype : isType, 
// 			showme : true, 
// 			dwimgsrc : DWimgsrc, 
// 			dwid : DWid,
// 			musicFileName : "abcd2.mp3", 
// 			msgTime : msgtime,
// 			filename : req.body.filename,
// 			size : '5.79kb'
// 		};
// 	ios.sockets.emit('new message music', data);
// 	console.log("done writting");
// 	res.send({"success" : "res from server"});
// 	});
// });

// app.post('/uploadPDF',function (req, res){
// 	var userName = req.body.username;
// 	var useravatar = req.body.userAvatar;
// 	var hasfile = req.body.hasFile;
// 	var ispdffile = req.body.isPDFFile;
// 	var isType = req.body.istype;
// 	var showMe = req.body.showme;
// 	var DWimgsrc = req.body.dwimgsrc;
// 	var DWid = req.body.dwid;
// 	var msgtime = req.body.msgTime;
// 	var filename = Date.now() + req.body.filename;
// 	var filecontent = req.body.filecontent;
// 	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
// 	// console.log(filecontent);
	
// 	fs.writeFile("./public/app/upload/doc/"+filename, filecontent, function(){
// 		// console.log("dwimgsrc", DWimgsrc);
// 		var data = { 
// 			username : userName, 
// 			userAvatar : useravatar, 
// 			repeatMsg : true, 
// 			hasFile : hasfile, 
// 			isPDFFile : ispdffile, 
// 			istype : isType, 
// 			showme : true, 
// 			dwimgsrc : DWimgsrc, 
// 			dwid : DWid,
// 			PDFFileName : "grid-computing.pdf", 
// 			msgTime : msgtime,
// 			filename : req.body.filename,
// 			size : '7.79mb'
// 		};
// 	ios.sockets.emit('new message PDF', data);
// 	console.log("done writting");
// 	res.send({"success" : "res from server"});
// 	});
// });
// // function base64ArrayBuffer(arrayBuffer) {
// //   var base64    = ''
// //   var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
 
// //   var bytes         = new Uint8Array(arrayBuffer)
// //   var byteLength    = bytes.byteLength
// //   var byteRemainder = byteLength % 3
// //   var mainLength    = byteLength - byteRemainder
 
// //   var a, b, c, d
// //   var chunk
 
// //   // Main loop deals with bytes in chunks of 3
// //   for (var i = 0; i < mainLength; i = i + 3) {
// //     // Combine the three bytes into a single integer
// //     chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
 
// //     // Use bitmasks to extract 6-bit segments from the triplet
// //     a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
// //     b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
// //     c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
// //     d = chunk & 63               // 63       = 2^6 - 1
 
// //     // Convert the raw binary segments to the appropriate ASCII encoding
// //     base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
// //   }
 
// //   // Deal with the remaining bytes and padding
// //   if (byteRemainder == 1) {
// //     chunk = bytes[mainLength]
 
// //     a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
 
// //     // Set the 4 least significant bits to zero
// //     b = (chunk & 3)   << 4 // 3   = 2^2 - 1
 
// //     base64 += encodings[a] + encodings[b] + '=='
// //   } else if (byteRemainder == 2) {
// //     chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
 
// //     a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
// //     b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
 
// //     // Set the 2 least significant bits to zero
// //     c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
 
// //     base64 += encodings[a] + encodings[b] + encodings[c] + '='
// //   }
  
// //   return base64
// // }
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var server = http.createServer(app);
var io = require('socket.io');
var ios = io.listen(server);
var nickname = [];
var i = [];
var x = [];
var online_member = [];
var temp1;
var socket_id;
var socket_data;

server.listen(8282);

app.use(bodyParser.json({ 
    limit: 1024 * 10000
}));
app.use(bodyParser.text({ 
    limit: 1024 * 10000
}));
app.use(bodyParser.raw({ 
    limit: 1024 * 10000
}));
app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/app/upload/images'));
app.use(express.static(__dirname + '/public/app/upload/music'));
app.use(express.static(__dirname + '/public/app/upload/doc'));
app.use(function(req, res, next) {														// CORS Issue Fix
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

ios.on('connection', function(socket){	

	socket.on('new user', function(data, callback){
		if(nickname[data.username])
			{
				callback({success:false});
			}else{
				callback({success:true});
				socket.username = data.username;
				socket.userAvatar = data.userAvatar;
				nickname[data.username] = socket;
			}
	});

	socket.on('get-online-members', function(data){
		var online_member = [];
		i = Object.keys(nickname);
		for(var j=0;j<i.length;j++ )
		{
			socket_id = i[j];
			socket_data = nickname[socket_id];
			temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
			online_member.push(temp1);
		}
		ios.sockets.emit('online-members', online_member);		
	});

	socket.on('send-message', function(data, callback){
		if(data.hasMsg){
			ios.sockets.emit('new message', data);
			callback({success:true});	
		}else if(data.hasFile){
			if(data.istype == "image"){
				// console.log("recieved file");
				// data.sendfile = "";
				socket.emit('new message image', data);
				// var base64file = base64ArrayBuffer(data.sendfile);
				// console.log("sending file");
				// data.sendfile = base64file;

				
				callback({success:true});
			} else if(data.istype == "music"){
				socket.emit('new message music', data);
				callback({success:true});
			} else if(data.istype == "PDF"){
				socket.emit('new message PDF', data);
				callback({success:true});
			}
		}else{
			callback({ success:false});
		}
		
	});

	socket.on('send-image', function(data, callback){
		console.log(data);
		callback("upload messege from server");	
	});

	socket.on('disconnect', function () {	
		console.log('one client disconnected');

		delete nickname[socket.username];
		online_member = [];
		x = Object.keys(nickname);
		for(var k=0;k<x.length;k++ )
    	{
        	socket_id = x[k];
        	socket_data = nickname[socket_id];
        	temp1 = {"username": socket_data.username, "userAvatar":socket_data.userAvatar};
            online_member.push(temp1);
    	}
		ios.sockets.emit('online-members', online_member);            	
   	});
});

app.post('/uploadImage',function (req, res){
	// console.log(req.body);
	var userName = req.body.username;
	var useravatar = req.body.userAvatar;
	var hasfile = req.body.hasFile;
	var isimagefile = req.body.isImageFile;
	var isType = req.body.istype;
	var showMe = req.body.dwimgsrc;
	var DWimgsrc = req.body.dwimgsrc;
	var DWid = req.body.dwid;
	var msgtime = req.body.msgTime;
	var filename = Date.now() + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
	// console.log(filecontent);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');
	fs.writeFile("./public/app/upload/images/"+filename, binaryData, "binary", function(){
		var data = { 
			username : userName, 
			userAvatar : useravatar, 
			repeatMsg : true, 
			hasFile : hasfile, 
			isImageFile : isimagefile, 
			istype : isType, 
			showme : showMe, 
			dwimgsrc : DWimgsrc, 
			dwid : DWid, 
			msgTime : msgtime, 
			serverimg : filename,
			filename : req.body.filename,
			size : '579kbs'
		};
	ios.sockets.emit('new message image', data);
    
	console.log("done writting", data);
	res.send({"success" : "res from server"});
	});
});
// ios.sockets.emit('new message music', data);

app.post('/uploadAudio',function (req, res){
	var userName = req.body.username;
	var useravatar = req.body.userAvatar;
	var hasfile = req.body.hasFile;
	var ismusicfile = req.body.isMusicFile;
	var isType = req.body.istype;
	var showMe = req.body.showme;
	var DWimgsrc = req.body.dwimgsrc;
	var DWid = req.body.dwid;
	var msgtime = req.body.msgTime;
	var filename = Date.now() + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
	// console.log(filecontent);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/music/"+filename, binaryData, "binary", function(){
		// console.log("dwimgsrc", DWimgsrc);
		var data = { 
			username : userName, 
			userAvatar : useravatar, 
			repeatMsg : true, 
			hasFile : hasfile, 
			isMusicFile : ismusicfile, 
			istype : isType, 
			showme : true, 
			dwimgsrc : DWimgsrc, 
			dwid : DWid,
			musicFileName : filename, 
			msgTime : msgtime,
			filename : req.body.filename,
			size : '5.79kb'
		};
	ios.sockets.emit('new message music', data);
	console.log("done writting");
	res.send({"success" : "res from server"});
	});
});

app.post('/uploadPDF',function (req, res){
	var userName = req.body.username;
	var useravatar = req.body.userAvatar;
	var hasfile = req.body.hasFile;
	var ispdffile = req.body.isPDFFile;
	var isType = req.body.istype;
	var showMe = req.body.showme;
	var DWimgsrc = req.body.dwimgsrc;
	var DWid = req.body.dwid;
	var msgtime = req.body.msgTime;
	var filename = Date.now() + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
	// console.log(filecontent);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/doc/"+filename, binaryData, "binary", function(){
		// console.log("dwimgsrc", DWimgsrc);
		var data = { 
			username : userName, 
			userAvatar : useravatar, 
			repeatMsg : true, 
			hasFile : hasfile, 
			isPDFFile : ispdffile, 
			istype : isType, 
			showme : true, 
			dwimgsrc : DWimgsrc, 
			dwid : DWid,
			PDFFileName : filename, 
			msgTime : msgtime,
			filename : req.body.filename,
			size : '7.79mb'
		};
	ios.sockets.emit('new message PDF', data);
	console.log("done writting");
	res.send({"success" : "res from server"});
	});
});
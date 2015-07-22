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

// server.listen(8282);

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
// 				socket.emit('new message image', data);
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
// 	binaryData = new Buffer(filecontent, 'base64').toString('binary');
// 	fs.writeFile("./public/app/upload/images/"+filename, binaryData, "binary", function(){
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
// 			serverfilename : filename,
// 			filename : req.body.filename,
// 			size : '579kbs'
// 		};
// 	ios.sockets.emit('new message image', data);
// 	res.send({"success" : "res from server"});
// 	});
// });

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
// 	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
// 	fs.writeFile("./public/app/upload/music/"+filename, binaryData, "binary", function(){
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
// 			serverfilename : filename, 
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
// 	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
// 	fs.writeFile("./public/app/upload/doc/"+filename, binaryData, "binary", function(){
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
// 			serverfilename : filename, 
// 			msgTime : msgtime,
// 			filename : req.body.filename,
// 			size : '7.79mb'
// 		};
// 	ios.sockets.emit('new message PDF', data);
// 	console.log("done writting");
// 	res.send({"success" : "res from server"});
// 	});
// });
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
var files_array  = [];

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
				socket.emit('new message image', data);
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
		// console.log(data);
		callback("upload messege from server");	
	});

	socket.on('disconnect', function () {	
		// console.log('one client disconnected');
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
	var userName = req.body.username;
	var useravatar = req.body.userAvatar;
	var hasfile = req.body.hasFile;
	var isimagefile = req.body.isImageFile;
	var isType = req.body.istype;
	var showMe = req.body.dwimgsrc;
	var DWimgsrc = req.body.dwimgsrc;
	var DWid = req.body.dwid;
	var msgtime = req.body.msgTime;
    var imgdatetimenow = Date.now();
	var filename =  imgdatetimenow + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
    // console.log("Date time now",imgdatetimenow);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');
	fs.writeFile("./public/app/upload/images/"+filename, binaryData, "binary", function(){
    var imagefile =  fs.statSync("./public/app/upload/images/"+filename);
    var imagesize =  bytesToSize(imagefile["size"]);
    // console.log("image file size",imagesize);
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
			serverfilename : filename,  //serverimg to be removed
			filename : req.body.filename,
			size : imagesize
		};
                
        var img_file = {
            dwid : DWid,
            filename : req.body.filename,
            filetype : req.body.istype,
            serverfilename : filename,
            serverfilepath : "./public/app/upload/images/"+filename,
            expirytime : imgdatetimenow + 120000

        };
        files_array.push(img_file);
        // console.log("Image file to add in files_array",img_file);
        // console.log("data in files_array",files_array);        
	ios.sockets.emit('new message image', data);
    
	// console.log("done writting", data);
	res.send({"success" : "res from server"});
	});
});

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
    var audiodatetimenow = Date.now();
	var filename = audiodatetimenow + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
	// console.log(filecontent);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/music/"+filename, binaryData, "binary", function(){
		// console.log("dwimgsrc", DWimgsrc);
    var audiofile =  fs.statSync("./public/app/upload/music/"+filename);
    var audiosize = bytesToSize(audiofile["size"]);
    // console.log("music file size",audiosize);

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
			serverfilename : filename, 
			msgTime : msgtime,
			filename : req.body.filename,
			size : audiosize
		};
        var audio_file = { 
            dwid : DWid,
            filename : req.body.filename,
            filetype : req.body.istype,
            serverfilename : filename,
            serverfilepath : "./public/app/upload/music/"+filename,
            expirytime : audiodatetimenow + (120000)           
        };
    files_array.push(audio_file);
    // console.log("Audio file to add in files_array",audio_file);
    // console.log("data in files_array",files_array);                
	ios.sockets.emit('new message music', data);
	// console.log("done writting");
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
    var pdfdatetimenow = Date.now();
	var filename = pdfdatetimenow + req.body.filename;
	var filecontent = req.body.filecontent;
	var filecontent = filecontent.substring(filecontent.indexOf(',')+1);
	// console.log(filecontent);
	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/doc/"+filename, binaryData, "binary", function(){
		// console.log("dwimgsrc", DWimgsrc);
    var pdffile =  fs.statSync("./public/app/upload/doc/"+filename);
    var pdfsize =  bytesToSize(pdffile["size"]);
    // console.log("pdf file size",pdfsize);
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
			serverfilename : filename, 
			msgTime : msgtime,
			filename : req.body.filename,
			size : pdfsize
		};
        var pdf_file = { 
            dwid : DWid,
            filename : req.body.filename,
            filetype : req.body.istype,
            serverfilename : filename,
            serverfilepath : "./public/app/upload/doc/"+filename,
            expirytime : pdfdatetimenow + (120000)           
        };
    files_array.push(pdf_file);
    // console.log("pdf file to add in files_array",pdf_file);
    // console.log("data in files_array",files_array);                        
	ios.sockets.emit('new message PDF', data);
	// console.log("done writting");
	res.send({"success" : "res from server"});
	});
});


app.post('/getfile', function(req, res){
    var data = req.body.dwid;
    var filenm = req.body.filename;
    //var fileid = 'ppdwid1437387292909';
    // console.log("received from request", req.body);
    // console.log("received from request data : ", data);
    var dwidexist = false;
    var req_file_data;
    
    for(var i = 0; i<files_array.length; i++)
    {
        if(files_array[i].dwid == data)
        {
            dwidexist = true;
            req_file_data = files_array[i];
        }
    }
    if(dwidexist == true)
    {
        if(req_file_data.expirytime < Date.now())
        {
            // console.log("inside expired");
	        console.log("This is the requested file data:",req_file_data);
	        var deletedfileinfo = { 
                isExpired : true,
	            expmsg : "File has beed removed."
	        	};
	            fs.unlink(req_file_data.serverfilepath, function(err){
	               	if (err) {
	                   	return console.error(err);
	                }
	               		console.log("File deleted successfully!");
	    				res.send(deletedfileinfo);           
	            });
               var index = files_array.indexOf(req_file_data);
               files_array.splice(index,1);
               console.log("after delete:",files_array);            
        }else{
        	// console.log("record found");
            var fileinfo = {
            	isExpired : false, 
            	filename : req_file_data.filename,            
            	serverfilename : req_file_data.serverfilename };
            res.send(fileinfo);
        }
    }else{         
  	    	// console.log("record not found");
	    	var deletedfileinfo = { 
	                isExpired : true,
	                expmsg : "File has beed removed."
	        };
	        res.send(deletedfileinfo);       
        }
});
setInterval(function() {routine_cleanup();}, 60000 * 0.5 );

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

function routine_cleanup()
{
    console.log("i am called on time");
    console.log("Length of files array",files_array.length);
    for(var i=0; i<files_array.length; i++)
    {
            console.log(i,":",files_array[i].expirytime)
            if(Date.now() > files_array[i].expirytime)
            {
                console.log("This file expired",files_array[i].filename);
                fs.unlink(files_array[i].serverfilepath, function(err) 
                          {
                   if (err) {
                       return console.error(err);
                            }
                   console.log("File deleted successfully!");
                            });
                   files_array.splice(i,1);
                   console.log("after delete:",files_array);

            }
    }
}

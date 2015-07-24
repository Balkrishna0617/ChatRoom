var express = require('express');			// express module
var app = express();						// initiating express app
var http = require('http');					// http module
var bodyParser = require('body-parser');	// body-parser module for reading request body
var fs = require('fs');						// fs module for handling file operations
var server = http.createServer(app);		// creating server
var io = require('socket.io');				// using sockets
var ios = io.listen(server);				// listening sockets

// Initializing Variables
var nickname = [];
var i = [];
var x = [];
var online_member = [];
var temp1;
var socket_id;
var socket_data;
var files_array  = [];

server.listen(8282);		// server starting on port '8282'

// cofiguring body-parser
app.use(bodyParser.json({	// setting json limit 	
    limit: 1024 * 10000
}));
app.use(bodyParser.text({ 	// setting text limit
    limit: 1024 * 10000
}));
app.use(bodyParser.raw({ 	// setting raw limit
    limit: 1024 * 10000
}));
app.use(bodyParser.urlencoded({		// setting url encoding
        extended: true
}));

// static file configuration
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/app/upload/images'));
app.use(express.static(__dirname + '/public/app/upload/music'));
app.use(express.static(__dirname + '/public/app/upload/doc'));

// CORS Issue Fix
app.use(function(req, res, next) {														
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//sockets handling
ios.on('connection', function(socket){	

	// creating new user if nickname doesn't exists
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

	// sending online members list
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

	// sending new message
	socket.on('send-message', function(data, callback){
		if (nickname[data.username]) {
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
		}		
	});

	// socket.on('send-image', function(data, callback){
	// 	// console.log(data);
	// 	callback("upload messege from server");	
	// });
	
	// disconnect user handling 
	socket.on('disconnect', function () {	
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

// route for uploading images asynchronously
app.post('/v1/uploadImage',function (req, res){
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

	binaryData = new Buffer(filecontent, 'base64').toString('binary');
	fs.writeFile("./public/app/upload/images/"+filename, binaryData, "binary", function(){
    var imagefile =  fs.statSync("./public/app/upload/images/"+filename);
    var imagesize =  bytesToSize(imagefile["size"]);

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
	ios.sockets.emit('new message image', data);
	res.send({"success" : "res from server"});
	});
});

// route for uploading audio asynchronously
app.post('/v1/uploadAudio',function (req, res){
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

	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/music/"+filename, binaryData, "binary", function(){
    var audiofile =  fs.statSync("./public/app/upload/music/"+filename);
    var audiosize = bytesToSize(audiofile["size"]);

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
	ios.sockets.emit('new message music', data);
	res.send({"success" : "res from server"});
	});
});

// route for uploading document asynchronously
app.post('/v1/uploadPDF',function (req, res){
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

	binaryData = new Buffer(filecontent, 'base64').toString('binary');	
	fs.writeFile("./public/app/upload/doc/"+filename, binaryData, "binary", function(){
    var pdffile =  fs.statSync("./public/app/upload/doc/"+filename);
    var pdfsize =  bytesToSize(pdffile["size"]);

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
	ios.sockets.emit('new message PDF', data);
	res.send({"success" : "res from server"});
	});
});

// route for checking requested file , does exist on server or not
app.post('/v1/getfile', function(req, res){
    var data = req.body.dwid;
    var filenm = req.body.filename;
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

    // CASE 1 : File Exists
    if(dwidexist == true)
    {
    	//CASE 2 : File Expired and Deleted
        if(req_file_data.expirytime < Date.now())
        {
	        var deletedfileinfo = { 
                isExpired : true,
	            expmsg : "File has beed removed."
	        	};
	            fs.unlink(req_file_data.serverfilepath, function(err){
	               	if (err) {
	                   	return console.error(err);
	                }
	    				res.send(deletedfileinfo);           
	            });
               var index = files_array.indexOf(req_file_data);
               files_array.splice(index,1);           
        }else{
        	// CASE 3 : File Exist and returned serverfilename in response
            var fileinfo = {
            	isExpired : false, 
            	filename : req_file_data.filename,            
            	serverfilename : req_file_data.serverfilename };
            res.send(fileinfo);
        }
    }else{  
    		// CASE 4 : File Doesn't Exists.       
	    	var deletedfileinfo = { 
	                isExpired : true,
	                expmsg : "File has beed removed."
	        };
	        res.send(deletedfileinfo);       
        }
});

// Routine Clean up call
setInterval(function() {routine_cleanup();}, 60000 * 0.5 );

// Size Conversion
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

// Routine cleanup function (files delete after specific interval)
function routine_cleanup()
{
    for(var i=0; i<files_array.length; i++)
    {
            if(Date.now() > files_array[i].expirytime)
            {
                fs.unlink(files_array[i].serverfilepath, function(err) 
                          {
                   if (err) {
                       return console.error(err);
                            }
                            });
                   files_array.splice(i,1);
            }
    }
}

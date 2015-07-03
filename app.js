var express = require('express');
var app = express();
var http = require('http');
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

server.listen(3000);

app.use(express.static(__dirname + '/public'));

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
		if(data.msg){
			ios.sockets.emit('new message', data);
			callback({success:true});	
		}else{
			callback({ success:false});
		}
		
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
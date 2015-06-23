var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io');
var ios = io.listen(server);
var nickname = [];
var i = [];
var socket_id;

server.listen(3000);

// app.get('/', function(req, res) {
// 	res.sendfile('index.html');
// });

app.use(express.static(__dirname + '/public'));
ios.on('connection', function(socket){
	// socket.on('send-message', function(data){
	// 	ios.sockets.emit('new message', data);
	// });

	socket.on('new user', function(data, callback){
		console.log("data : ", data);
		
		// console.log("nickname : ", nickname);
		// if(nickname[data])
		// {
		// 	callback(false);
		// }
		// else{
		// 	callback(true);
		// 	nickname[data] = socket;
		//     i = Object.keys(nickname);
		//     console.log("socket key:", i);
  //  			ios.sockets.emit('user-list', i);
		// }
		/*console.log("nickname : ", nickname);
	    i = Object.keys(nickname);
		console.log("userlist:"+i);
		for(var j = 0; j<i.length; j++)
		{
			ios.sockets.emit('user-list', i[j]);
		}*/

	});
 
  // socket.on('disconnect', function () {

  //     //socket.emit('disconnected');
  //     console.log('one client disconnected');
  //     delete socket.namespace.sockets[socket.id];
	 //  //var k  = nickname.indexOf(socket);
	 //  //console.log("disconnected socket:",k);
	 //  //delete nickname[k];
	 //  i = Object.keys(nickname);
	 //  console.log("socket key after disconnect:", i);
	  
  // });
  // socket.on('DelPlayer', function (data) {
		// //delete nickname[data];
		// console.log("DelPlayer event fired");
		// console.log(data,":DELETED");
		// console.log(nickname,":NICKNAME")
  // });
});


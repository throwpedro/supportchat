
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/customer.html');
//});

var roomNo = 1;
io.on('connection', function (socket) {
  //console.log(io.nsps['/'].adapter.rooms["room-"+roomNo]);
  if (io.nsps['/'].adapter.rooms["room-" + roomNo] && io.nsps['/'].adapter.rooms["room-" + roomNo].length > 1) {
    //console.log(io.nsps['/'].adapter.rooms["room-"+roomNo]);
    roomNo++;
  }
  socket.join("room-" + roomNo);

  //console.log(io.sockets.adapter.rooms);
  //console.log(io.sockets.clients().adapter.rooms);
  /*//talk only in your room.
  socket.on('chat message', function(msg){
    io.to('room-'+roomNo).emit('chat message', msg);
  });*/
  //send to everyone in the room
  io.sockets.in("room-" + roomNo).emit('connectToRoom', "room-" + roomNo);
 
});

var socketsconnected = io.sockets.sockets;

io.on('connection', function (socket) {
  //console.log(Object.keys(socketsconnected));
  //console.log(Object.keys(socketsconnected).length);
  socket.on('chat message', function (msg, roomName) {
    // console.log(io.sockets.adapter.rooms);
    console.log(msg, roomName);
    io.to(roomName).emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var firstClient = true;
var firstId = "";
var roomNo = 1;
io.on('connection', function (socket) {
  
  if (firstClient) {
    firstId = socket.id;
    firstClient = false;
  }
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
  console.log(socket.id);
  if(socket.id != firstId){
    io.to(firstId).emit('chat message', msg);
  }
  
    
    //socket.broadcast.to(roomName).emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
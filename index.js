
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/customer.html');
//});
var firstClient = true;
var firstId = "";
var roomNo = 1;
io.on('connection', function (socket) {
  console.log("hej");
  
  if (firstClient) {
    firstId = socket.id;
    firstClient = false;
  }
  console.log("socketid: " + socket.id);
  
  //io.sockets.in("room-" + roomNo).emit('connectToRoom', "room-" + roomNo);

});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
  
  console.log(socket.id);
  console.log(firstId);
  console.log(msg);
  //io.emit('chat message', msg);
  io.to(firstId).emit('chat message', msg);
    
    //socket.broadcast.to(roomName).emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
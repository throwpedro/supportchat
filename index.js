
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
var roomNo = 1;
io.on('connection', function (socket) {
  console.log("hej");
  //if (io.nsps['/'].adapter.rooms["room-" + roomNo] && io.nsps['/'].adapter.rooms["room-" + roomNo].length > 1) {
    //console.log(io.nsps['/'].adapter.rooms["room-"+roomNo]);
  //  roomNo++;
  //}
  //socket.join("room-" + roomNo);
  if (firstClient) {
    socket.id = "hrskyen";
    firstClient = false;
  }
  console.log("socketid: " + socket.id);
  
  //io.sockets.in("room-" + roomNo).emit('connectToRoom', "room-" + roomNo);

});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
  
  console.log(socket.id);
  console.log(msg);
  //io.emit('chat message', msg);
  io.to(socket.id).emit('chat message', msg);
    
    //socket.broadcast.to(roomName).emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
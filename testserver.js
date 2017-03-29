var io = require('socket.io')();

var socket = io.listen(1000, {});

socket.on('connection', function(socket){
  socket.on('chat message', function(msg){
    socket.emit('chat message', msg);
  });
});
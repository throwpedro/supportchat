
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var skyClient = true;
var skyId = "";
var skyIds = [];
var customerIds = [];
io.on('connection', function (socket) {
  //push ids from all hrskyen clients to array
  if (socket.handshake.headers.referer == 'http://localhost:3000/hrskyen.html') {
    skyId = socket.id;
    if(!skyIds.includes(skyId)){
    skyIds.push(skyId);
    }
  }
  else if(!customerIds.includes(socket.id)){
    console.log("push to customerids " + socket.id);
    customerIds.push(socket.id);
  }
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    //-----------------------------
    //send from customer to hrskyen
    //-----------------------------
    console.log(socket.id);
    console.log(customerIds);
    console.log(skyIds);
    if (!skyIds.includes(socket.id)) {
      console.log("hej2");
      for (var i = 0; i < skyIds.length; i++) {
        skyId = skyIds[i];
        io.to(skyId).emit('chat message', {msg: msg, id: socket.id});
      }
    }
    /*else if(customerIds.includes(socket.id)){
      console.log("hej");
      io.to(socket.id).emit('chat message', msg);
    }*/
    //-----------------------------
    //end
    //-----------------------------
    //-----------------------------
    //send from hrksyen to customer
    //-----------------------------

    //-----------------------------
    //end
    //-----------------------------
  });
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});
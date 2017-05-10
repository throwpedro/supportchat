
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const low = require('lowdb');
const db = low('db.json');
db.defaults({ storedconversations: []}).write();

app.use(express.static(__dirname + '/public'));

var skyClient = true;
var skyId = "";
var skyIds = [];
var customerIds = [];
io.on('connection', function (socket) {
  if (socket.handshake.headers.referer == 'http://localhost:3000/hrskyen.html') {
    skyId = socket.id;
    if (!skyIds.includes(skyId)) {
      skyIds.push(skyId);
    }
  }
  else if (!customerIds.includes(socket.id)) {
    customerIds.push(socket.id);
  }
});

io.on('connection', function (socket) {
  socket.on('chat message', function (data) {
    //-----------------------------
    //send from customer to hrskyen
    //-----------------------------
    if (!skyIds.includes(socket.id)) {
      for (var i = 0; i < skyIds.length; i++) {
        skyId = skyIds[i];
        io.to(skyId).emit('chat message', { msg: data, id: socket.id });
        db.get('storedconversations').push({idfrom: socket.id, idto: skyId, message: data}).write();
      }
    }
    //-----------------------------
    //send from hrksyen to customer
    //-----------------------------
    if (customerIds.includes(data.id)) {
      io.to(data.id).emit('chat message', data.msg);
      db.get('storedconversations').push({idfrom: skyId, idto: data.id, message: data.msg}).write();
    }
  });
  socket.on('disconnect', function(){
    for (var i = 0; i < skyIds.length; i++) {
      io.to(skyIds[i]).emit('client disconnect', socket.id);
    }
  });
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});
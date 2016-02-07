
var http = require('http');

var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);

app.use(express.static(__dirname + '/../public'));
app.use('/css', express.static(__dirname + '/../node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/../node_modules/font-awesome/fonts'));

server.listen(8080);

io.on('connection', function (socket) {
  var id = socket.id;

  socket.on('mouse', function (data) {
    data.id = id;
    socket.broadcast.emit('mouse', {
      x: data.x,
      y: data.y,
      pressed: data.pressed,
      id: id
    });
  });
  socket.on('disconnect', function () {
    io.emit('leave', id);
  });
});

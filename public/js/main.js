
(function () {
  'use strict';

  var socket = io.connect();
  var cursors = {};

  socket.on('mouse', function (data) {
    var id = data.id;
    var x = data.x;
    var y = data.y;
    var pressed = data.pressed;

    var cursor = cursors[id];
    if (!cursor) {
      cursor = cursors[id] = document.createElement('i');
      document.body.appendChild(cursor);
    }
    if (pressed) {
      cursor.className = 'cursor fa fa-hand-rock-o';
    } else {
      cursor.className = 'cursor fa fa-hand-pointer-o';
    }
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  });

  socket.on('leave', function (id) {
    cursors[id].classList.add('fadeout');
    setTimeout(function () {
      document.body.removeChild(cursors[id]);
    }, 1000);
  });

  var pressed = false;

  window.addEventListener('mousedown', function (e) {
    pressed = true;
    sendMouse({x: e.pageX, y: e.pageY});
  });

  window.addEventListener('touchstart', function (e) {
    pressed = true;
    sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});
  });

  window.addEventListener('mouseup', function (e) {
    pressed = false;
    sendMouse({x: e.pageX, y: e.pageY});
  });

  window.addEventListener('touchend', function (e) {
    pressed = false;
    sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});
  });

  window.addEventListener('mousemove', function (e) {
    sendMouse({x: e.pageX, y: e.pageY});
  });

  window.addEventListener('touchmove', function (e) {
    sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});
  });

  function sendMouse (data) {
    socket.emit('mouse', {
      x: data.x - window.innerWidth / 2 | 0,
      y: data.y - window.innerHeight / 2 | 0,
      pressed: pressed
    });
  }
})();

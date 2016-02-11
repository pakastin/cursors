
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

  window.addEventListener('mousedown', onMousedown);
  window.addEventListener('touchstart', onMousedown);

  function onMousedown (e) {
    if (e.type === 'touchstart') {
      pressed = false;

      sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});

      window.addEventListener('touchmove', onMousemove);
      window.addEventListener('touchend', onMouseup);
    } else {
      pressed = true;

      sendMouse({x: e.pageX, y: e.pageY});

      window.addEventListener('mousemove', onMousemove);
      window.addEventListener('mouseup', onMouseup);
    }
  }

  function onMousemove (e) {
    if (e.type === 'touchmove') {
      sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});
    } else {
      sendMouse({x: e.pageX, y: e.pageY});
    }
  };

  function onMouseup (e) {
    pressed = false;
    if (e.type === 'touchend') {
      window.removeEventListener('touchmove', onMousemove);
      window.removeEventListener('touchend', onMouseup);

      sendMouse({x: e.touches[0].pageX, y: e.touches[0].pageY});
    } else {
      window.removeEventListener('touchmove', onMousemove);
      window.removeEventListener('touchend', onMouseup);

      sendMouse({x: e.pageX, y: e.pageY});
    }
  };

  function sendMouse (data) {
    socket.emit('mouse', {
      x: data.x - window.innerWidth / 2 | 0,
      y: data.y - window.innerHeight / 2 | 0,
      pressed: pressed
    });
  }
})();

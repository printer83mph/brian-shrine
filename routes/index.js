var express = require('express');
var socket_io = require('socket.io');
var imgur = require('imgur');
var router = express.Router();

var io = socket_io();

var users = {};

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'GFS Fan Site'
  });
});

/* GET game page */
router.get('/game', function (req, res, next) {
  res.render('game', {
    title: 'Brian Game'
  });
});

/* GET game page */
router.get('/chat', function (req, res, next) {
  res.render('chat', {
    title: 'Brian Chat'
  });
});

io.on('connection', function (socket) {
  users[socket.id] = "anon";
  socket.on('name', function (nm) {
    let nam = nm;
    for (var scId in users) {
      if (users[scId] == nam) {
        nam += "_fake";
      }
    }
    users[socket.id] = nam;
    socket.emit('name', users[socket.id]);
    io.emit('chat message', null, `${nam} has joined Brian Chat`);
  });

  socket.on('chat message', function (msg, img) {
    if (img) {
			imgur.uploadBase64(img)
				.then(function (json) {
					io.emit('chat message', users[socket.id], msg, json.data.link);
				})
				.catch(function (err) {
					io.emit('chat message', users[socket.id], (msg) + ' - [failed image upload]');
				});
    } else {
			io.emit('chat message', users[socket.id], (msg));
    }
  });

  socket.on('disconnect', function() {
    io.emit('chat message', null, `${users[socket.id]} has disconnected`);
    users[socket.id] = null;
  });
});

router.io = io;

module.exports = router;
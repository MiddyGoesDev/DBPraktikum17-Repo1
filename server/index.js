var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 80;

http.listen(port, function(){
    console.log('listening on *:' + port);
});

var opponents = [];
var objects = [];

io.on('connection', function(socket) {

    socket.on('join', function (opponent) {
        console.log('user ' + socket.id + ' has connected');

        opponents[socket.id] = opponent;
        objects[socket.id] = opponent;

        console.log(Object.assign({}, opponents));

        socket.broadcast.emit('joined', opponent);

        socket.emit('initialize opponents', Object.assign({}, opponents));
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');

        socket.broadcast.emit('left', opponents[socket.id]);

        delete opponents[socket.id];
    });

    socket.on('change', function (object) {
        console.log('Object has changed');

        opponents[socket.id] = object;

        socket.broadcast.emit('update', object);
    });

    socket.on('add', function (object) {
        console.log(object.id + ' fired projectile');
        objects[socket.id] = object;
        socket.broadcast.emit('update', object);
    });

});


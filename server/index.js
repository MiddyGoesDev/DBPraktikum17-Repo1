var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

http.listen(port, function(){
    console.log('listening on *:' + port);
});

var characters = {};
var objects = {};

io.on('connection', socket => {

    socket.on('join', character => {
        characters[socket.id] = character;
        objects[character.id] = character;
    });

    socket.on('disconnect', () => {
        delete characters[socket.id];
    });

    socket.on('add', object => {

    });

    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);

        console.log(Object.assign({}, objects));
    });

    socket.on('destroy', object => {

    });

    console.log(socket.id + ' is connected');
});

/*
io.on('connection', function(socket) {

    socket.on('join', function (opponent) {
        console.log('user ' + socket.id + ' has connected');

        opponents[socket.id] = opponent;
        objects[opponent.id] = opponent;

        console.log(Object.assign({}, opponents));

        socket.broadcast.emit('joined', opponent);

        socket.emit('initialize opponents', Object.assign({}, opponents));
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');

        socket.broadcast.emit('left', opponents[socket.id]);

        try {
            delete objects[opponents[socket.id].id];
            delete opponents[socket.id];
        } catch (err) {
            console.log('user not found');
        }
    });

    socket.on('change', function (object) {
        console.log('Object has changed');

        objects[object.id] = object;

        socket.broadcast.emit('update', object);
        console.log(Object.assign({}, opponents), Object.assign({}, objects));
    });

    socket.on('add', function (object) {
        console.log(object.id + ' fired projectile');
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    socket.on('destroy', function (object) {
        console.log('projectile' + object.id + 'destroyed');
        socket.broadcast.emit('destroyed', object.id);
    });

});
*/
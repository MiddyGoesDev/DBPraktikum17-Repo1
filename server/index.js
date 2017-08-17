var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

http.listen(port, function(){
    console.log('listening on *:' + port);
});

var directions = [0, 45, 90, 135, 180, 225, 270, 315];

var characters = {};
var objects = {};

var cows = [];
var cowZone = { x: 150, y: 150, width: 200, height: 200};

for (var i=0; i<5; i++) {
    var cow = {
        id: Math.floor(new Date().valueOf() * Math.random()),
        type: 'Cow',
        x: Math.round(cowZone.x + cowZone.width * Math.random()),
        y: Math.round(cowZone.y + cowZone.height * Math.random()),
        direction: directions[Math.floor(directions.length * Math.random())],
        animation: 'idle'
    };
    cows.push(cow);
    objects[cow.id] = cow;
}

io.on('connection', socket => {

    socket.on('join', character => {
        characters[socket.id] = character;
        objects[character.id] = character;

        cows.forEach(cow => socket.emit('spawn', cow));
    });

    socket.on('disconnect', () => {
        delete characters[socket.id];
    });

    socket.on('add', object => {
        objects[object.id] = object;
    });

    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    socket.on('destroy', object => {
        delete objects[object.id];
    });

    cows.forEach(cow => setInterval(() => {
        if (Math.random() > 0.5) {
            cow.x += (Math.floor(Math.random() * 20) - 10);
        } else {
            cow.y += (Math.floor(Math.random() * 20) - 10);
        }
        cow.direction = directions[Math.floor(directions.length * Math.random())];

        socket.emit('update', cow);
    }, 5000 + Math.floor(Math.random() * 5000)));

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
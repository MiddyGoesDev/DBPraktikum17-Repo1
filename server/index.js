var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

http.listen(port, function(){
    console.log('listening on *:' + port);
});

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
        animation: 'idle',
        direction: { x: 0, y: 1, name: 'South' }
    };
    cows.push(cow);
    objects[cow.id] = cow;
    io.emit('spawn', cow);
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
        var distance = (Math.floor(Math.random() * 20) - 10);

        if (Math.random() > 0.5) {
            if (cow.x + distance < cowZone.x || cow.x + distance > cowZone.x + width) {
                cow.x -= distance;
            } else {
                cow.x += distance;
            }
        } else {
            if (cow.y + distance < cowZone.y || cow.y + distance > cowZone.y + height) {
                cow.y -= distance;
            } else {
                cow.y += distance;
            }
        }

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
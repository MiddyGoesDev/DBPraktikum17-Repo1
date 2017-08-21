var fs = require('fs');
var db = require('baqend');
var app = require('http').createServer((request, result) => fs.readFile(__dirname + '/index.html', (err, data) => {
    if (err) {
        result.writeHead(500);
        return result.end('Error loading index.html');
    }
    result.writeHead(200);
    result.end(data);
}));
var io = require('socket.io')(app);
var port = 8080;

db.connect('black-water-73').then(() => console.log('Connected to Baqend'));

setTimeout(() => { db.ItemMask.find().resultList((result) => console.log(result)); }, 1000);

app.listen(port, function(){
    console.log('listening on *:' + port);
});

var characters = {};
var objects = {};

var cows = [];
var cowZone = { x: 150, y: 150, width: 200, height: 200 };

for (var i=0; i<1; i++) {
    var cow = {
        id: Math.floor(new Date().valueOf() * Math.random()),
        type: 'Cow',
        x: Math.round(cowZone.x + cowZone.width * Math.random()),
        y: Math.round(cowZone.y + cowZone.height * Math.random()),
        animation: 'idle',
        direction: { x: 0, y: 1, name: 'South' },
        hp: 100
    };
    cows.push(cow);
    objects[cow.id] = cow;
    console.log('create cow ' + cow.id);
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

    socket.on('punch', object => {
        console.log('punch');
        console.log(object);
        socket.broadcast.emit('spawn fist', object);
    });

    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    socket.on('destroy', object => {
        delete objects[object.id];
    });

    console.log(socket.id + ' is connected');
});

cows.forEach(cow => setInterval(() => {
    var distance = (Math.floor(Math.random() * 20) - 10);
    var destX = cow.x;
    var destY = cow.y;

    if (Math.random() > 0.5) {
        if (cow.x + distance < cowZone.x || cow.x + distance > cowZone.x + cowZone.width) {
            destX -= distance;
        } else {
            destX += distance;
        }
    } else {
        if (cow.y + distance < cowZone.y || cow.y + distance > cowZone.y + cowZone.height) {
            destY -= distance;
        } else {
            destY += distance;
        }
    }

    cow.direction = getDirection(cow.x, cow.y, destX, destY);
    cow.x = destX;
    cow.y = destY;
    io.emit('update', cow);
    console.log('emit cow ' + cow.id + ' x: ' + cow.x + ' y: ' + cow.y);
}, 5000 + Math.floor(Math.random() * 5000)));

function directionName(x, y) {
    return (y < 0 ? 'North' : y > 0 ? 'South' : '') + (x < 0 ? 'West' : x > 0 ? 'East' : '');
}

function getDirection(x, y, destX, destY) {
    var signX = (destX - x) / Math.max(Math.abs(destX - x), 1);
    var signY = (destY - y) / Math.max(Math.abs(destY - y), 1);
    return {
        x: signX,
        y: signY,
        name: directionName(signX, signY)
    };
}

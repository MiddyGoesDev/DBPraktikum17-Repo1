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

app.listen(port, function(){
    console.log('listening on *:' + port);
});

var characters = {};
var objects = {};

var cows = [];
var aliveCows = 0;
var maxCows = 5;
var cowZone = { x: 150, y: 150, width: 200, height: 200 };

for (var i=0; i<maxCows; i++) {
    io.emit('spawn', deliverCow());
    aliveCows++;
}

function deliverCow() {
    var cow = {
        id: Math.floor(new Date().valueOf() * Math.random()),
        type: 'Cow',
        x: Math.round(cowZone.x + cowZone.width * Math.random()),
        y: Math.round(cowZone.y + cowZone.height * Math.random()),
        animation: 'idle',
        direction: { x: 0, y: 1, name: 'South' },
        currentHP: 100
    };
    cows.push(cow);
    objects[cow.id] = cow;
    return cow;
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
        socket.broadcast.emit('spawn fist', object);
    });

    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    socket.on('destroy', object => {
        delete objects[object.id];
    });
    
    socket.on('cow died', cow => {
        console.log('cow killer', cow.killer);
        console.log('character', characters[socket.id]);

        if (cow.killer === characters[socket.id].id) {
            console.log('cow died: ' + cow.id);
            console.log(cows);
            cows = cows.filter(object => object.id !== cow.id);
            console.log('cow post');
            console.log(cows);

            delete objects[cow.id];
            setTimeout(() => socket.emit('spawn', deliverCow()), 15000);
            db.Statistic.find().equal('character', cow.killer).singleResult().then(statistic => {
                statistic.kills++;
                statistic.update();
            });
            db.ItemMask.find().equal('type', 'main_hand').resultList().then(items => {
                var randomItem = items[Math.floor(items.length * Math.random())];
                socket.emit('drop loot', {
                    x: cow.x + 16,
                    y: cow.y + 16,
                    item: {
                        name: randomItem.name,
                        type: randomItem.type,
                        vitality: roll(randomItem, 'vitality'),
                        dexterity: roll(randomItem, 'dexterity'),
                        strength: roll(randomItem, 'strength'),
                        intelligence: roll(randomItem, 'intelligence'),
                    }
                });
            });
        }
    });

    console.log(socket.id + ' is connected');
});

function roll(item, attribute) {
    return item['min_' + attribute] + Math.floor((item['max_' + attribute] - item['min_' + attribute]) * Math.random());
}

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

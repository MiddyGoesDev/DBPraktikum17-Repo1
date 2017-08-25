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

app.listen(port, function () {
    console.log('listening on *:' + port);
});

var characters = {};
var objects = {};

var cows = [];
var aliveCows = 0;
var maxCows = 10;
var cowZone = {x: 800, y: 3300, width: 1100, height: 700};
var dragon = {
    id: generateId(),
    type: 'Dragon',
    x: 1738,
    y: 710,
    animation: 'idle',
    direction: {x: 0, y: 1, name: 'South'},
    currentHP: 500,
    aggro: {}
};
var gate = {
    id: generateId(),
    type: 'Gate',
    x: 1725,
    y: 1075,
    opened: false
};

io.emit('spawn', dragon);
if (!gate.opened) {
    io.emit('spawn', gate);
}
for (var i = 0; i < maxCows; i++) {
    io.emit('spawn', deliverCow());
    aliveCows++;
}

function deliverCow() {
    var dx = (Math.floor(Math.random() * 10000) % 3) - 1;
    var cow = {
        id: generateId(),
        type: 'Cow',
        x: Math.round(cowZone.x + cowZone.width * Math.random()),
        y: Math.round(cowZone.y + cowZone.height * Math.random()),
        animation: 'idle',
        direction: {x: dx, y: 1, name: directionName(dx, 1)},
        currentHP: 50,
        aggro: {}
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
        socket.emit('spawn', dragon);
        if (!gate.opened) {
            socket.emit('spawn', gate);
            console.log('emit gate', gate);
        }
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

    socket.on('use', object => {
        socket.broadcast.emit('spawn weapon', object);
    });

    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    socket.on('destroy', object => {
        delete objects[object.id];
    });

    socket.on('cow died', cow => {
        if (cow.hitter === characters[socket.id].id) {
            console.log('cow died: ' + cow.id);
            cows = cows.filter(object => object.id !== cow.id);

            delete objects[cow.id];
            setTimeout(() => socket.emit('spawn', deliverCow()), 15000);
            db.Statistic.find().equal('character', cow.hitter).singleResult().then(statistic => {
                statistic.kills++;
                statistic.update();
            });
            var queryBuilder = db.ItemMask.find();
            queryBuilder.or(queryBuilder.equal('type', 'main_hand'), queryBuilder.equal('type', 'head')).resultList().then(items => {
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
                socket.emit('drop gold', {
                    x: cow.x + (Math.ceil(32 * Math.random()) - 16),
                    y: cow.y + (Math.ceil(32 * Math.random()) - 16),
                    amount: Math.ceil(10 * Math.random())
                });
            });
        }
    });

    socket.on('hit cow', cow => {
        try {
            if (cow.hitter === characters[socket.id].id) {
                objects[cow.id] = cow;
                cow.x = objects[characters[socket.id].id].x;
                cow.y = objects[characters[socket.id].id].y;
                io.emit('update', cow);
                var id = setInterval(() => {
                    try {
                        cow.x = objects[characters[socket.id].id].x;
                        cow.y = objects[characters[socket.id].id].y;
                        io.emit('update', cow);
                    } catch (err) {
                        clearInterval(id);
                    }
                }, 200);
            }
        } catch (err) {
            console.log('could not update cow (character not known)');
        }

    });

    socket.on('open gate', () => {
        if (!gate.opened) {
            gate.opened = true;
            socket.broadcast.emit('gate opened', gate);
            console.log('gate opened', gate);
            setTimeout(() => {
                gate.opened = false;
                socket.emit('spawn', gate);
                console.log('gate closed', gate);
            }, 300000);
        }
    });

    console.log(socket.id + ' is connected');
});

function roll(item, attribute) {
    return item['min_' + attribute] + Math.ceil((item['max_' + attribute] - item['min_' + attribute]) * Math.random());
}

/*
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
 */

function generateId() {
    return Math.floor(new Date().valueOf() * Math.random());
}

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

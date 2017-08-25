var fs = require('fs');
var db = require('baqend');
// creates a node server
var app = require('http').createServer((request, result) =>
    // try to read index to get baqend library.
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            result.writeHead(500);
            return result.end('Error loading index.html');
        }
        result.writeHead(200);
        result.end(data);
    }));
var io = require('socket.io')(app);
var port = 8080;

// connect to baqend
db.connect('black-water-73').then(() => console.log('Connected to Baqend'));

app.listen(port, function () {
    console.log('listening on *:' + port);
});

// array-object of all characters playing (sockerId => character)
var characters = {};
// array-object of all objects on server (objectId => object)
var objects = {};
// array of all cows on server
var cows = [];
// count of alive cows
var aliveCows = 0;
// count of max cows
var maxCows = 10;
// TODO define a spawnzone table in baqend
// spawnzone of cows
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
objects[dragon.id] = dragon;

var gate = {
    id: generateId(),
    type: 'Gate',
    x: 1725,
    y: 1075,
    opened: false
};
objects[gate.id] = gate;

// generate all cows
for (var i = 0; i < maxCows; i++) {
    deliverCow();
    aliveCows++;
}

/**
 *  creates a random cow in cowZone
 */
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

// when a player connects to the server
io.on('connection', socket => {

    // initialize the character
    socket.on('join', character => {
        console.log('character ' + character.id + ' joined');

        characters[socket.id] = character;
        objects[character.id] = character;

        cows.forEach(cow => socket.emit('spawn', cow));
        socket.emit('spawn', dragon);
        console.log('spawn ' + dragon.id + ' dragon');
        if (!gate.opened) {
            socket.emit('spawn', gate);
            console.log('spawn ' + gate.id + ' gate');
        }
    });

    // remove character from lists
    socket.on('disconnect', () => {
        delete objects[characters[socket.id].id];
        delete characters[socket.id];
        console.log(socket.id + ' is disconnected');
    });

    // add an object to server
    socket.on('add', object => {
        objects[object.id] = object;
    });

    // tell everyone that you punched
    socket.on('punch', object => {
        socket.broadcast.emit('spawn fist', object);
    });

    // tell everyone that you used a weapon
    socket.on('use', object => {
        socket.broadcast.emit('spawn weapon', object);
    });

    // tell everyone that something changed, and they have to update
    socket.on('change', object => {
        objects[object.id] = object;
        socket.broadcast.emit('update', object);
    });

    // destroy an object on server
    socket.on('destroy', object => {
        delete objects[object.id];
    });

    // increases the cow-kills-count, spawns a new cow after 15 sec and drops an item for all
    socket.on('cow died', cow => {
        if (cow.hitter === characters[socket.id].id) {
            console.log('cow died: ' + cow.id);
            cows = cows.filter(object => object.id !== cow.id);
            delete objects[cow.id];

            // deliver a new cow
            setTimeout(() => io.emit('spawn', deliverCow()), 15000);

            // increases the killcount
            db.Statistic.find().equal('character', cow.hitter).singleResult().then(statistic => {
                statistic.kills++;
                statistic.update();
            });

            // drop an item
            var queryBuilder = db.ItemMask.find();
            queryBuilder.or(queryBuilder.equal('type', 'main_hand'), queryBuilder.equal('type', 'head')).resultList()
                .then(items => {
                    var randomItem = items[Math.floor(items.length * Math.random())];
                    io.emit('drop loot', {
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
                    // TODO: drop gold
                    io.emit('drop gold', {
                        x: cow.x + (Math.ceil(32 * Math.random()) - 16),
                        y: cow.y + (Math.ceil(32 * Math.random()) - 16),
                        amount: Math.ceil(10 * Math.random())
                    });
                });
        }
    });

    // set aggro on player, when he hit a cow
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

    // open the gate for everyone
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

io.emit('socket up');

/**
 * Timeout not playing characters
 */
function checkTimeout() {
    db.Character.find().equal('playing', true).resultList().then(result => {
        var notConnected = result.filter(character => objects[character.id] === undefined);
        notConnected.forEach(character => {
            character.playing = false;
            character.update();
        })
    });
}
setInterval(checkTimeout, 300000);
setTimeout(checkTimeout, 10000);

/**
 * roll a attribute of an item
 * @param item
 * @param attribute
 * @returns {number}
 */
function roll(item, attribute) {
    return item['min_' + attribute] + Math.ceil((item['max_' + attribute] - item['min_' + attribute]) * Math.random());
}

/**
 * Moves the cows randomly in random position when idling
 * TODO: remove interval when cow gets aggro
 */
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

/**
 * generate a random id, like in GameObject
 * @returns {number}
 */
function generateId() {
    return Math.floor(new Date().valueOf() * Math.random());
}

/**
 * Gets the name of direction signs (Direction.js)
 * @param x sign -1 0 1
 * @param y sign -1 0 1
 * @returns {string}
 */
function directionName(x, y) {
    return (y < 0 ? 'North' : y > 0 ? 'South' : '') + (x < 0 ? 'West' : x > 0 ? 'East' : '');
}

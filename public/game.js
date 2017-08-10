setTimeout(() => { startGame() });



var socket = io('http://localhost:3001');

var rectangle;
var gameStage;
var circle;

var framesWalk = [];
for(var i = 0; i < 3; i++)
{
    framesWalk.push([16 + 16*i, 144, 16, 16]);
}

var framesIdle = [];
for(var i = 0; i < 4; i++)
{
    framesIdle.push([16 + 16*i, 112, 16, 16]);
}

var guyData = {
    images: ['./assets/sprites.png'],
    frames: framesWalk.concat(framesIdle)
        // x, y, width, height, imageIndex*, regX*, regY*

        // etc.
    ,
    animations: {
        walk: [0,2,"walk",0.3],
        idle: [3,6, "idle", 0.25]
    }
    /*frames: {width:16, height:16, regX: 32, regY:64, spacing:0, margin:0},

    animations: {
        stand:0,
        run:[1,1],
        jump:[6,8,"run"]
    }*/
};



var spriteSheet = new createjs.SpriteSheet(guyData);
// var guy = new Character(spriteSheet, "idle", 42);
var guys = [];
var guy = new createjs.Sprite(spriteSheet, "idle");
guy.idling = true;
guy.x = 10;
guy.y = 10;
guy.id = Math.floor(Math.random() * 1000000);

var wallData = {
    images: ['./assets/brickwall.png'],
    frames: {width:64, height:64, count:1, regX: 0, regY:0, spacing:0, margin:0}
};


var wallSpriteSheet = new createjs.SpriteSheet(wallData);
rectangle = new createjs.Sprite(wallSpriteSheet);

var bullet;
bullet = new createjs.Shape();
bullet.graphics.beginFill("black").drawCircle(8, 8, 2);
bullet.x = 50;
bullet.y = 50;

// initialize stage and shapes
function startGame() {
    var gameField = document.getElementById('game-field');
    var gameWindow = document.getElementById('game-window');
    gameField.width = gameWindow.clientWidth;
    gameField.height = gameWindow.clientHeight;
    gameStage = new createjs.Stage('game-field');

    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(100, 100, 10);
    circle.x = 100;
    circle.y = 50;


    rectangle.x = 30;
    //rectangle.y = 64;

    guys[guy.id] = guy;

    gameStage.addChild(circle);
    gameStage.addChild(rectangle);
    gameStage.addChild(guy);
    gameStage.update();

    console.log(ndgmr.checkPixelCollision(guy,rectangle,0.01,true) !== null);
    //console.log(ndgmr.checkRectCollision(guy,rectangle));

    createjs.Ticker.addEventListener("tick", handleTick);


    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;
    // document.onkeypress = keyHeld;
}

// Character Movement
const KEYCODE_S = 83;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const DIRECTION_WEST = 0;
const DIRECTION_EAST = 1;
const DIRECTION_NORTH = 2;
const DIRECTION_SOUTH = 3;
var movespeed = 3;


function tryMove(direction, speed) {
    var overlapThreshold = movespeed;
    var detectedCollision;

    switch(direction) {
        case DIRECTION_WEST: // left
            guy.x -= speed;
            detectedCollision = ndgmr.checkPixelCollision(guy,rectangle,0.01,true);
            if (detectedCollision !== false) {
                var width = detectedCollision.width;
                var height = detectedCollision.height;
                if (height >= overlapThreshold){
                    guy.x += width;
                }
            }
            break;
        case DIRECTION_EAST: // right
            guy.x += speed;
            detectedCollision = ndgmr.checkPixelCollision(guy,rectangle,0.01,true);
            console.log(ndgmr.checkPixelCollision(guy,rectangle,0.01,true));
            if (detectedCollision !== false) {
                var width = detectedCollision.width;
                var height = detectedCollision.height;
                if (height >= overlapThreshold){
                    guy.x -= width;
                }

            }
            break;
        case DIRECTION_NORTH: // up
            guy.y -= speed;
            detectedCollision = ndgmr.checkPixelCollision(guy,rectangle,0.01,true);
            if (detectedCollision !== false) {
                var width = detectedCollision.width;
                var height = detectedCollision.height;
                if (width >= overlapThreshold){
                    guy.y += height;
                }
            }
            break;
        case DIRECTION_SOUTH: // down
            guy.y += speed;
            detectedCollision = ndgmr.checkPixelCollision(guy,rectangle,0.01,true);
            if (detectedCollision !== false) {
                var width = detectedCollision.width;
                var height = detectedCollision.height;
                if (width >= overlapThreshold){
                    guy.y -= height;
                }
            }
            break;
    }
}

function move(direction, speed){
    var axis;
    var sign;
    var detectedCollision;
    var width;
    var height;
    var overlapThreshold = movespeed;

    switch(direction) {
        case DIRECTION_WEST: // LEFT
            axis = 'x';
            sign = -1;
            break;
        case DIRECTION_EAST: // RIGHT
            axis = 'x';
            sign = 1;
            break;
        case DIRECTION_NORTH: // UP
            axis = 'y';
            sign = -1;
            break;
        case DIRECTION_SOUTH: // DOWN
            axis = 'y';
            sign = 1;
            break;
    }

    if(guy.idling) {
        guy.gotoAndPlay("walk");
        guy.idling = false;
    }

    guy[axis] += sign * speed;
    detectedCollision = ndgmr.checkPixelCollision(guy,rectangle,0.01,true);

    if (detectedCollision !== false) {
        width = detectedCollision.width;
        height = detectedCollision.height;
        if(axis === 'y') {
            if (width >= overlapThreshold) {
                guy[axis] -= sign * height;
            }
        }
        else {
            if (height >= overlapThreshold){
            guy[axis] -= sign * width;
            }

        }

    }
}

function keyPressed(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            move(DIRECTION_WEST, movespeed);
            break;
        case KEYCODE_RIGHT:
            move(DIRECTION_EAST, movespeed);
            break;
        case KEYCODE_UP:
            move(DIRECTION_NORTH, movespeed);
            break;
        case KEYCODE_DOWN:
            move(DIRECTION_SOUTH, movespeed);
            break;
        case KEYCODE_S:
            gameStage.addChild(bullet);
            bullet.x = guy.x;
            bullet.y = guy.y;
            break;
    }
    gameStage.update();
}

function keyReleased(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            guy.idling = true;
            guy.gotoAndPlay("idle");
            break;
        case KEYCODE_RIGHT:
            guy.idling = true;
            guy.gotoAndPlay("idle");
            break;
        case KEYCODE_UP:
            guy.idling = true;
            guy.gotoAndPlay("idle");
            break;
        case KEYCODE_DOWN:
            guy.idling = true;
            guy.gotoAndPlay("idle");
            break;
    }
    socket.emit('move guy', { id: guy.id, x: guy.x, y: guy.y });
    gameStage.update();
}

/* wird nie ausgelöst :S

function keyHeld(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            guy.gotoAndPlay("walk");
            guy.x -= movespeed;
            break;
        case KEYCODE_RIGHT:
            console.log('held right');
            guy.gotoAndPlay("walk");
            guy.x += movespeed;
            break;
        case KEYCODE_UP:
            guy.y -= movespeed;
            break;
        case KEYCODE_DOWN:
            guy.y += movespeed;
            break;
    }
    gameStage.update();
}
*/

function handleTick(event) {
    // Actions carried out each tick (aka frame)
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        gameStage.update();
    }
}

// mc1 = Objekt1, mc2 = Objekt2
function checkCollision(mc1, mc2) {

    // für sprites
    m1x = mc1.x;
    m1y = mc1.y;
    m1w = mc1.getBounds().width;
    m1h = mc1.getBounds().height;

    m2x = mc2.x;
    m2y = mc2.y;
    m2w = mc2.getBounds().width;
    m2h = mc2.getBounds().height;


    /* für shapes
    m2x = mc2.graphics.command.x;
    m2y = mc2.graphics.command.y;
    m2w = mc2.graphics.command.w;
    m2h = mc2.graphics.command.h;
    */

    if (    m1x >= m2x + m2w     //  mc1 rechts von mc2
        ||  m1x + m1w <= m2x     //  mc1 links von mc2
        ||  m1y >= m2y + m2h     //  mc1 unterhalb von mc2
        ||  m1y + m1h <= m2y) {  //  mc1 oberhalb von mc2
        return false;
    } else {
        return true;
    }
}

/*
function Character(spriteSheet, state, subject) {
    createjs.Sprite.call(spriteSheet, state);

    this.subject = subject;
}
*/

socket.emit('join', { id: guy.id, x: guy.x, y: guy.y });
socket.on('guy joined', function (guy) {
    addGuy(guy);
});
socket.on('guy left', function (enemy) {
    gameStage.removeChild(guys[enemy.id]);
    delete guys[enemy.id];
    $('#chat-messages').append('<div class="chat-message">Player ' + enemy.id + ' has disconnected</div>');
});
socket.on('initialize player', function (data) {
    for (var id in data) {
        if (data.hasOwnProperty(id)) {
            addGuy(data[id]);
        }
    }
});
socket.on('update guy', function (guy) {
    guys[guy.id].x = guy.x;
    guys[guy.id].y = guy.y;
    gameStage.update();
});

function addGuy(guy) {
    if (typeof(guys[guy.id]) === "undefined") {
        guys[guy.id] = new createjs.Sprite(spriteSheet, "idle");
        guys[guy.id].x = guy.x;
        guys[guy.id].y = guy.y;

        gameStage.addChild(guys[guy.id]);
        gameStage.update();

        $('#chat-messages').append('<div class="chat-message">Player ' + guy.id + ' has joined</div>');
    }
}
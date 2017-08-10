setTimeout(() => { startGame() });



var socket = io('http://localhost:3001');

var rectangle;
var gameStage;

var framesWalk = [];
for(let i = 0; i < 3; i++)
{
    framesWalk.push([16 + 16*i, 144, 16, 16]);
}

var framesIdle = [];
for(let i = 0; i < 4; i++)
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

function Character(posX, posY, data, type) {

    this.move = (direction, speed) => {
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

        if(this.idling) {
            this.gotoAndPlay("walk");
            this.idling = false;
        }

        this[axis] += sign * speed;
        this.updateSpritePosition();

        detectedCollision = ndgmr.checkPixelCollision(this.sprite,rectangle,0.01,true);

        if (detectedCollision !== false) {
            width = detectedCollision.width;
            height = detectedCollision.height;
            if(axis === 'y') {
                if (width >= overlapThreshold) {
                    this[axis] -= sign * height;
                }
            }
            else {
                if (height >= overlapThreshold) {
                    this[axis] -= sign * width;
                }
            }

        }
        this.updateSpritePosition();
    };

    this.gotoAndPlay = (state) => {
        this.sprite.gotoAndPlay(state);
    };

    this.updateSpritePosition = () => {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };

    this.x = posX;
    this.y = posY;
    this.type = type;
    this.id = Math.floor(Math.random() * 1000000);
    this.idling = true;
    var spriteSheet = new createjs.SpriteSheet(data);
    this.sprite = new createjs.Sprite(spriteSheet, type);


    this.updateSpritePosition();
}


var guys = [];

var guy = new Character(10, 10, guyData, "idle");




var wallData = {
    images: ['./assets/brickwall.png'],
    frames: {width:64, height:64, count:1, regX: 0, regY:0, spacing:0, margin:0}
};

var wallSpriteSheet = new createjs.SpriteSheet(wallData);
rectangle = new createjs.Sprite(wallSpriteSheet);

var bulletData = {
    images: ['./assets/sprites.png'],
    frames: [[64, 80, 16, 16]]
};

var bullet;
bulletSpriteSheet = new createjs.SpriteSheet(bulletData);
bullet = new createjs.Sprite(bulletSpriteSheet);


// initialize stage and shapes
function startGame() {
    var gameField = document.getElementById('game-field');
    var gameWindow = document.getElementById('game-window');
    gameField.width = gameWindow.clientWidth;
    gameField.height = gameWindow.clientHeight;
    gameStage = new createjs.Stage('game-field');

    rectangle.x = 30;
    //rectangle.y = 64;

    guys[guy.id] = guy;

    gameStage.addChild(rectangle);
    gameStage.addChild(guy.sprite);
    gameStage.update();

    createjs.Ticker.addEventListener("tick", handleTick);


    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;
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




function keyPressed(event) {
    // console.log(event.keyCode);
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            guy.move(DIRECTION_WEST, movespeed);
            break;
        case KEYCODE_RIGHT:
            guy.move(DIRECTION_EAST, movespeed);
            break;
        case KEYCODE_UP:
            guy.move(DIRECTION_NORTH, movespeed);
            break;
        case KEYCODE_DOWN:
            guy.move(DIRECTION_SOUTH, movespeed);
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

function handleTick(event) {
    // Actions carried out each tick (aka frame)
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        gameStage.update();
        bullet.x += 6;
    }
}





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
setTimeout(() => { startGame(); });



var socket = io('http://207.154.243.43');

var rectangle;
var gameStage;


function Character(posX, posY, type) {

    this.update = () => {
        if(this.sprite.currentAnimation !== 'punch') {
        if (this.walkingDirection !== null) {
            this.move();

            if(this.sprite.currentAnimation === 'idle')
            {
                this.gotoAndPlay("walk");
            }
        }
        else if(this.punching) {
            this.gotoAndPlay('punch');
        }
        else if (this.sprite.currentAnimation !== 'idle') {
            this.gotoAndPlay("idle");
        }
    }};

    this.punch = () => {
        this.gotoAndPlay('punch');
    };

    this.setPosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.updateSpritePosition(x, y);
    }

    this.move = () => {
        var axis;
        var sign;
        var detectedCollision;
        var width;
        var height;
        var overlapThreshold = this.moveSpeed;

        switch(this.walkingDirection) {
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



        this[axis] += sign * this.moveSpeed;
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

    // Felder

    this.frames = [];

    for (let j = 0; j < 18; j++) {
        for(let i = 0; i < 12; i++) {
            this.frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.guyData = {
        images: ['./assets/sprites.png'],
        frames: this.frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2,"walk",0.3],
            idle: [6 * 12,6 * 12 + 3, "idle", 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };

    this.x = posX;
    this.y = posY;
    this.type = type;
    this.id = Math.floor(Math.random() * 1000000);
    this.moveSpeed = 3;
    this.sprite = new createjs.Sprite(new createjs.SpriteSheet(this.guyData), type);

    this.walkingDirection = null;

    this.updateSpritePosition();
}


var guys = [];

var guy = new Character(10, 10, "idle");




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

    rectangle.x = 200;
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





function keyPressed(event) {
    // console.log(event.keyCode);
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            guy.walkingDirection = DIRECTION_WEST;
            break;
        case KEYCODE_RIGHT:
            guy.walkingDirection = DIRECTION_EAST;
            break;
        case KEYCODE_UP:
            guy.walkingDirection = DIRECTION_NORTH;
            break;
        case KEYCODE_DOWN:
            guy.walkingDirection = DIRECTION_SOUTH;
            break;
        case KEYCODE_S:
            guy.punch();
            bullet.x = guy.x + 7;
            bullet.y = guy.y;
            gameStage.addChild(bullet);
            break;
    }
    gameStage.update();
}

function keyReleased(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
        case KEYCODE_RIGHT:
        case KEYCODE_UP:
        case KEYCODE_DOWN:
            guy.walkingDirection = null;
            break;
    }
    socket.emit('move guy', { id: guy.id, x: guy.x, y: guy.y });
    gameStage.update();
}

function handleTick(event) {
    // Actions carried out each tick (aka frame)
    guy.update();

    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        gameStage.update();
        bullet.x += 6;
        var detectedCollision = ndgmr.checkPixelCollision(bullet,rectangle,0.01,true);
        if (detectedCollision !== false) {
            gameStage.removeChild(bullet);
        }
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
    guys[guy.id].setPosition(guy.x, guy.y);
    gameStage.update();
});

function addGuy(guy) {
    if (typeof(guys[guy.id]) === "undefined") {
        guys[guy.id] = new Character(10, 10, "idle");
        guys[guy.id].setPosition(guy.x, guy.y);

        gameStage.addChild(guys[guy.id].sprite);
        gameStage.update();

        //$('#chat-messages').append('<div class="chat-message">Player ' + guy.id + ' has joined</div>');
    }
}

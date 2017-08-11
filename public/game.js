setTimeout(() => {
    startGame();
});

var socket = io('http://207.154.243.43');


// Character Movement
const KEYCODE_S = 83;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const DIRECTION_NORTH = 0;
const DIRECTION_NORTHEAST = 45;
const DIRECTION_EAST = 90;
const DIRECTION_SOUTHEAST = 135;
const DIRECTION_SOUTH = 180;
const DIRECTION_SOUTHWEST = 225;
const DIRECTION_WEST = 270;
const DIRECTION_NORTHWEST = 315;

var rectangle;
var gameStage;
var gameObjects = [];
var activeKeys = [];
var activeObject = null;

function GameObject(x, y) {

    this.construct = () => {
        this.sprite = new createjs.Sprite(new createjs.SpriteSheet(this.data), this.type);
        gameStage.addChild(this.sprite);
        this.updateSpritePosition();
    };

    this.destruct = () => {
        gameStage.removeChild(this.sprite);
        delete this;
    };

    this.update = () => {

    };

    this.emit = () => {

    };

    this.handleEvent = () => {

    };

    this.updateSpritePosition = () => {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };

    this.x = x;
    this.y = y;
    this.data = null;
    this.sprite = null;
    this.type = null;
    this.direction = DIRECTION_SOUTH;
    this.speed = 0;
    this.armor = 0;
    this.hp = 1;

}


function Character(x, y) {

    GameObject.call(this, x, y);

    this.update = () => {
        if (!this.isBusy() && this.isWalking()) {
            this.move();
        }
    };

    this.handleEvent = () => {
        var lastKey = activeKeys[activeKeys.length -1];
        var secondToLastKey = activeKeys[activeKeys.length -2];
        switch (lastKey) {
            case KEYCODE_LEFT:
                if (secondToLastKey === KEYCODE_UP) this.direction = DIRECTION_NORTHWEST;
                else if (secondToLastKey === KEYCODE_DOWN) this.direction = DIRECTION_SOUTHWEST;
                else this.direction = DIRECTION_WEST;

                this.walk();
                break;
            case KEYCODE_RIGHT:
                if (secondToLastKey === KEYCODE_UP) this.direction = DIRECTION_NORTHEAST;
                else if (secondToLastKey === KEYCODE_DOWN) this.direction = DIRECTION_SOUTHEAST;
                else this.direction = DIRECTION_EAST;

                this.walk();
                break;
            case KEYCODE_UP:
                if (secondToLastKey === KEYCODE_LEFT) this.direction = DIRECTION_NORTHWEST;
                else if (secondToLastKey === KEYCODE_RIGHT) this.direction = DIRECTION_NORTHEAST;
                else this.direction = DIRECTION_NORTH;

                this.walk();
                break;
            case KEYCODE_DOWN:
                if (secondToLastKey === KEYCODE_LEFT) this.direction = DIRECTION_SOUTHWEST;
                else if (secondToLastKey === KEYCODE_RIGHT) this.direction = DIRECTION_SOUTHEAST;
                else this.direction = DIRECTION_SOUTH;

                this.walk();
                break;
            case KEYCODE_S:
                this.punch();
                break;
            default:
                this.idle();
        }
    };

    this.punch = () => {
        if (!this.isPunching()) {
            this.sprite.gotoAndPlay('punch');
            gameObjects.push(new Bullet(this.x, this.y, this.direction));
        }
    };

    this.idle = () => {
        if (!this.isIdling()) {
            this.sprite.gotoAndPlay('idle');
        }
    };

    this.isBusy = () => {
        return this.isPunching();
    };

    this.isIdling = () => {
        return this.sprite.currentAnimation === 'idle';
    };

    this.isPunching = () => {
        return this.sprite.currentAnimation === 'punch';
    };

    this.isWalking = () => {
        return this.sprite.currentAnimation === 'walk';
    };

    this.walk = () => {
        if (!this.isWalking()) {
            this.sprite.gotoAndPlay('walk');
        }
    };

    this.setPosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.updateSpritePosition(x, y);
    };

    this.move = () => {
        var signX = 0;
        var signY = 0;

        switch (this.direction) {
            case DIRECTION_NORTH:
                signY = -1;
                break;
            case DIRECTION_NORTHEAST:
                signY = -1;
            case DIRECTION_EAST:
                signX = 1;
                break;
            case DIRECTION_SOUTHEAST:
                signX = 1;
            case DIRECTION_SOUTH:
                signY = 1;
                break;
            case DIRECTION_SOUTHWEST:
                signY = 1;
            case DIRECTION_WEST:
                signX = -1;
                break;
            case DIRECTION_NORTHWEST:
                signX = -1;
                signY = -1;
        }

        this.x += signX * this.speed;
        this.y += signY * this.speed;

        this.updateSpritePosition();
    };

    /*
    this.checkCollision = () => {

        var detectedCollision;
        var width;
        var height;
        var overlapThreshold = this.speed;

        detectedCollision = ndgmr.checkPixelCollision(this.sprite, rectangle, 0.01, true);

        if (detectedCollision !== false) {
            width = detectedCollision.width;
            height = detectedCollision.height;
            if (axis === 'y') {
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
    */

    // Felder

    this.frames = [];

    for (let j = 0; j < 18; j++) {
        for (let i = 0; i < 12; i++) {
            this.frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.data = {
        images: ['./assets/sprites.png'],
        frames: this.frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2, "walk", 0.3],
            idle: [6 * 12, 6 * 12 + 3, "idle", 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };

    this.type = 'idle';

    this.speed = 3;

    this.construct();
}

function Projectile(x, y, direction) {

    GameObject.call(this, x, y);

    this.direction = direction;
}

function Bullet(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.update = () => {
        this.x += 6;
        this.updateSpritePosition();
    };

    this.speed = 6;
    this.data = {
        images: ['./assets/sprites.png'],
        frames: [[64, 80, 16, 16]]
    };
    this.construct();
}

function Wall(x, y) {
    
}

function GameStage() {

    this.construct = () => {
        this.stage = new createjs.Stage('game-field');
    };

    this.update = () => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.stage.update();
    };

    this.stage = null;
    this.gameObjects = [];
    this.activeObject = null;
    this.networkObjects = [];

    this.construct();
}

var guys = [];

var guy;

var wallData = {
    images: ['./assets/brickwall.png'],
    frames: {width: 64, height: 64, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
};

var wallSpriteSheet = new createjs.SpriteSheet(wallData);
rectangle = new createjs.Sprite(wallSpriteSheet);


// initialize stage and shapes
function startGame() {
    var gameField = document.getElementById('game-field');
    var gameWindow = document.getElementById('game-window');
    gameField.width = gameWindow.clientWidth;
    gameField.height = gameWindow.clientHeight;
    gameStage = new createjs.Stage('game-field');

    guy = new Character(10, 10);
    activeObject = guy;
    rectangle.x = 200;
    //rectangle.y = 64;

    guys[guy.id] = guy;

    gameObjects.push(guy);


    gameStage.addChild(rectangle);
    gameStage.update();

    createjs.Ticker.addEventListener("tick", handleTick);

    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;

    socket.emit('join', {id: guy.id, x: guy.x, y: guy.y});
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
    });
}

function keyPressed(event) {
    if (activeKeys.lastIndexOf(event.keyCode) === -1) {
        activeKeys.push(event.keyCode);
    }
    activeObject.handleEvent();
}

function keyReleased(event) {
    activeKeys = activeKeys.filter((keyCode) => {
        return keyCode !== event.keyCode;
    });
    activeObject.handleEvent();
}


/*
function keyPressed(event) {
    console.log('key pressed: ' + event.keyCode);
    switch (event.keyCode) {
        case KEYCODE_LEFT:
            guy.direction = DIRECTION_WEST;
            guy.walk();
            break;
        case KEYCODE_RIGHT:
            guy.direction = DIRECTION_EAST;
            guy.walk();
            break;
        case KEYCODE_UP:
            guy.direction = DIRECTION_NORTH;
            guy.walk();
            break;
        case KEYCODE_DOWN:
            guy.direction = DIRECTION_SOUTH;
            guy.walk();
            break;
        case KEYCODE_S:
            guy.punch();
            break;
    }
    gameStage.update();
}

function keyReleased(event) {
    console.log('key released: ' + event.keyCode);

    switch (event.keyCode) {
        case KEYCODE_LEFT:
        case KEYCODE_RIGHT:
        case KEYCODE_UP:
        case KEYCODE_DOWN:
            guy.idle();
            break;
    }
    socket.emit('move guy', {id: guy.id, x: guy.x, y: guy.y});
    gameStage.update();
}
*/

function handleTick(event) {
    // Actions carried out each tick (aka frame)
    gameObjects.forEach(function (gameObject) {
        gameObject.update();
    });
    //console.log(!guy.isBusy() && guy.isWalking());
    //console.log(guy.sprite.currentAnimation);
    gameStage.update();
    console.log(activeKeys);
    socket.emit('move guy', {id: guy.id, x: guy.x, y: guy.y});

    /*
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        gameStage.update();
        bullet.x += 6;
        var detectedCollision = ndgmr.checkPixelCollision(bullet, rectangle, 0.01, true);
        if (detectedCollision !== false) {
            gameStage.removeChild(bullet);
        }
    }
    */
}

function addGuy(guy) {
    if (typeof(guys[guy.id]) === "undefined") {
        guys[guy.id] = new Character(10, 10);
        guys[guy.id].setPosition(guy.x, guy.y);

        $('#chat-messages').append('<div class="chat-message">Player ' + guy.id + ' has joined</div>');
    }
}
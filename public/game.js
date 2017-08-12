setTimeout(() => { resizeGame(); startGame(); });

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

var gameStage = null;
var activeKeys = [];

// initialize stage and shapes
function startGame() {
    document.body.onresize = resizeGame;

    gameStage = new GameStage();
    gameStage.initialize();

    document.onkeydown = gameStage.keyPressed;
    document.onkeyup = gameStage.keyReleased;
    // Actions carried out each tick (aka frame)
    createjs.Ticker.addEventListener("tick", () => { gameStage.update(); });

    socket.on('initialize opponents', function (data) {
        console.log('initialize opponents');
        console.log(data);
        for (let id in data) {
            if (data.hasOwnProperty(id) && data[id].id !== gameStage.activeObject.id) {
                gameStage.link(new OpponentGuy(data[id].x, data[id].y), id);
            }
        }
    });

    socket.on('joined', (opponent) => {
        gameStage.link(new OpponentGuy(opponent.x, opponent.y), opponent.id);

        $('#chat-messages').append('<div class="chat-message">Player ' + opponent.id + ' has joined</div>');
    });

    socket.on('left', function (opponent) {
        gameStage.unlink(opponent.id);

        $('#chat-messages').append('<div class="chat-message">Player ' + opponent.id + ' has disconnected</div>');
    });
}

function GameStage() {

    this.construct = () => {
        this.stage = new createjs.Stage('game-field');
    };

    this.initialize = () => {
        this.activeObject = new PlayerGuy(10, 10);
        new Wall(200, 0);
    };

    this.update = () => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.stage.update();
    };

    this.add = (object) => {
        this.gameObjects.push(object);
        this.stage.addChild(object.sprite);
    };

    this.link = (object, id) => {
        gameStage.add(object);
        gameStage.networkObjects[id] = object;
    };

    this.unlink = (id) => {
        gameStage.stage.removeChild(this.networkObjects[id]);
        this.gameObjects.filter((object) => { return object.id !== id; });
        delete this.networkObjects[id];
    };

    this.keyPressed = (event) => {
        if (activeKeys.lastIndexOf(event.keyCode) === -1) {
            activeKeys.push(event.keyCode);
        }
        this.activeObject.handleEvent();
    };

    this.keyReleased = (event) => {
        activeKeys = activeKeys.filter((keyCode) => {
            return keyCode !== event.keyCode;
        });
        this.activeObject.handleEvent();
    };

    this.stage = null;
    this.gameObjects = [];
    this.activeObject = null;
    this.networkObjects = [];

    this.construct();
}

function GameObject(x, y) {

    this.construct = () => {
        this.sprite = new createjs.Sprite(new createjs.SpriteSheet(this.data), this.type);
        gameStage.add(this);
        this.updatePosition(this.x, this.y);
    };

    this.destruct = () => {
        gameStage.removeChild(this.sprite);
        delete this;
    };

    this.update = () => { };

    this.handleEvent = () => { };

    this.move = () => {
        var signX = 0, signY = 0;

        switch (this.direction) {
            case DIRECTION_NORTH:     signY = -1; break;
            case DIRECTION_NORTHEAST: signY = -1;
            case DIRECTION_EAST:      signX = 1; break;
            case DIRECTION_SOUTHEAST: signX = 1;
            case DIRECTION_SOUTH:     signY = 1; break;
            case DIRECTION_SOUTHWEST: signY = 1;
            case DIRECTION_WEST:      signX = -1; break;
            case DIRECTION_NORTHWEST: signX = -1; signY = -1;
        }

        this.updatePosition(this.x + signX * this.speed, this.y + signY * this.speed);
        this.emit('change');
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    };

    this.emit = (action) => {
        socket.emit(action, {
            id: this.id,
            x: this.x,
            y: this.y,
            type: this.sprite.currentAnimation,
            direction: this.direction });
    };

    socket.on('update', function (object) {
        let gameObject = gameStage.networkObjects[object.id];
        gameObject.updatePosition(object.x, object.y);
        gameObject.type = object.type;
        gameObject.direction = object.direction;
    });

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

    this.id = Math.floor(new Date().valueOf() * Math.random());
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

    this.idle = () => {
        if (!this.isIdling()) {
            this.sprite.gotoAndPlay('idle');
        }
    };

    this.punch = () => {
        if (!this.isPunching()) {
            this.sprite.gotoAndPlay('punch');
            new Bullet(this.x, this.y, this.direction);
        }
    };

    this.walk = () => {
        if (!this.isWalking()) {
            this.sprite.gotoAndPlay('walk');
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

    this.type = 'idle';
}

function PlayerGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (!this.isBusy() && this.isWalking()) {
            this.move();
        }
    };

    this.handleEvent = () => {
        let lastKey = activeKeys[activeKeys.length -1];
        let secondToLastKey = activeKeys[activeKeys.length -2];
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
                this.emit('change');
                break;
            default:
                this.idle();
                this.emit('change');
        }
    };

    let frames = [];
    for (let j = 0; j < 18; j++) {
        for (let i = 0; i < 12; i++) {
            frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.data = {
        images: ['./assets/sprites.png'],
        frames: frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2, "walk", 0.3],
            idle: [6 * 12, 6 * 12 + 3, "idle", 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };
    this.speed = 3;
    this.construct();
    this.emit('join');
}

function OpponentGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        switch (this.type) {
            case 'idle': this.idle(); break;
            case 'walk': this.walk(); break;
            case 'punch': this.punch(); break;
        }
    };

    let frames = [];

    for (let j = 0; j < 18; j++) {
        for (let i = 0; i < 12; i++) {
            frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.data = {
        images: ['./assets/sprites.png'],
        frames: frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2, 'walk', 0.3],
            idle: [6 * 12, 6 * 12 + 3, 'idle', 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };

    this.construct();
}

function Projectile(x, y, direction) {

    GameObject.call(this, x, y);

    this.update = () => {
        this.move();
    };

    this.direction = direction;
}

function Bullet(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.speed = 6;
    this.data = {
        images: ['./assets/sprites.png'],
        frames: [[64, 80, 16, 16]]
    };
    this.construct();
}

function Wall(x, y) {

    GameObject.call(this, x, y);

    this.data = {
        images: ['./assets/brickwall.png'],
        frames: {width: 64, height: 64, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
    };
    this.construct();
}

/*
function handleTick(event) {
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        gameStage.update();
        bullet.x += 6;
        var detectedCollision = ndgmr.checkPixelCollision(bullet, rectangle, 0.01, true);
        if (detectedCollision !== false) {
            gameStage.removeChild(bullet);
        }
    }

}
*/

function resizeGame() {
    const gameField = document.getElementById('game-field');
    const gameWindow = document.getElementById('game-window');
    gameField.width = gameWindow.clientWidth;
    gameField.height = gameWindow.clientHeight;
}
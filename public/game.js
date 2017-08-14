setTimeout(() => { resizeGame(); startGame(); }, 1000);

// var socket = io('http://207.154.243.43');
// var socket = io('http://localhost:8080');

DB.connect("black-water-73", (response) => { });


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

    /*
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

    socket.on('update', function (object) {
        let gameObject = gameStage.networkObjects[object.id];
        gameObject.updatePosition(object.x, object.y);
        for (let property in object) {
            if (object.hasOwnProperty(property)) {
                gameObject[property] = object[property];
            }
        }
    });
    */
}

function GameStage() {

    this.construct = () => {
        this.stage = new createjs.Stage('game-field');
    };

    this.initialize = () => {
        this.activeObject = new PlayerGuy(10, 10);
        new Wall(200, 0);

        // var query = DB.Opponent.find().notEqual('id', '/db/Opponent/' + this.activeObject.id);
        // query.resultStream(result => console.log(result), err => console.log(err), console.log('offline'));
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

    this.remove = (object) => {
        gameStage.stage.removeChild(object.sprite);
        gameStage.gameObjects = gameStage.gameObjects.filter((gameObject) => {
            return gameObject.id !== object.id; });
        delete gameStage.networkObjects[this.id];
        delete this;
    };

    this.link = (object, id) => {
        gameStage.add(object);
        gameStage.networkObjects[id] = object;
    };

    this.unlink = (id) => {
        gameStage.stage.removeChild(this.networkObjects[id]);
        this.gameObjects = this.gameObjects.filter((object) => { return object.id !== id; });
        delete this.networkObjects[id];
    };

    this.near = (object) => {
        return this.gameObjects.filter((gameObject) => { return gameObject.id !== object.id });
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
        this.sprite = new createjs.Sprite(new createjs.SpriteSheet(this.data), this.animation);
        gameStage.add(this);
        this.updatePosition(this.x, this.y);
    };

    this.destruct = () => {
        gameStage.remove(this);
    };

    this.update = () => { };

    this.handleEvent = () => { };

    this.handleCollision = (object, collision) => { };

    this.check = () => {
        let near = gameStage.near(this);
        for (let i=0; i<near.length; i++) {
            let collision = this.checkCollision(near[i]);
            if (collision !== false) {
                this.handleCollision(near[i], collision);
            }
        }
    };

    this.move = () => {
        this.updatePosition(this.x + this.signX * this.speed, this.y + this.signY * this.speed);
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    };

    this.updateSign = () => {
        this.signX = 0; this.signY = 0;

        switch (this.direction) {
            case DIRECTION_NORTH:     this.signY = -1; break;
            case DIRECTION_NORTHEAST: this.signY = -1;
            case DIRECTION_EAST:      this.signX = 1; break;
            case DIRECTION_SOUTHEAST: this.signX = 1;
            case DIRECTION_SOUTH:     this.signY = 1; break;
            case DIRECTION_SOUTHWEST: this.signY = 1;
            case DIRECTION_WEST:      this.signX = -1; break;
            case DIRECTION_NORTHWEST: this.signX = -1; this.signY = -1;
        }
    };

    this.changeDirection = (direction) => {
        this.direction = direction;
        this.updateSign();
    };

    this.emit = (action) => {

        /*
        socket.emit(action, {
            id: this.id,
            x: this.x,
            y: this.y,
            animation: this.sprite.currentAnimation,
            direction: this.direction });
        */
    };

    this.checkCollision = (object) => {
        return ndgmr.checkPixelCollision(this.sprite, object.sprite, 0.01, true);
    };

    this.type = 'GameObject';
    this.id = Math.floor(new Date().valueOf() * Math.random());
    this.x = x;
    this.y = y;
    this.data = null;
    this.sprite = null;
    this.animation = null;
    this.signX = 0;
    this.signY = 0;
    this.direction = null;
    this.changeDirection(DIRECTION_SOUTH);
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
            new Bullet(this.x + this.signX * 5, this.y + this.signY * 5, this.direction);
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

    this.type = 'Character';
    this.animation = 'idle';
}

function PlayerGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (!this.isBusy() && this.isWalking()) {
            this.move();
            this.check();
            this.emit('change');
        }
    };

    this.emit = (action) => {
        // var player = DB.Opponent.find().equal('id', DB.User.me.id);
        // player.playing = true;
        // player.update();
    };

    this.handleEvent = () => {
        let lastKey = activeKeys[activeKeys.length -1];
        let secondToLastKey = activeKeys[activeKeys.length -2];
        switch (lastKey) {
            case KEYCODE_LEFT:
                if (secondToLastKey === KEYCODE_UP) this.changeDirection(DIRECTION_NORTHWEST);
                else if (secondToLastKey === KEYCODE_DOWN) this.changeDirection(DIRECTION_SOUTHWEST);
                else this.changeDirection(DIRECTION_WEST);

                this.walk();
                break;
            case KEYCODE_RIGHT:
                if (secondToLastKey === KEYCODE_UP) this.changeDirection(DIRECTION_NORTHEAST);
                else if (secondToLastKey === KEYCODE_DOWN) this.changeDirection(DIRECTION_SOUTHEAST);
                else this.changeDirection(DIRECTION_EAST);

                this.walk();
                break;
            case KEYCODE_UP:
                if (secondToLastKey === KEYCODE_LEFT) this.changeDirection(DIRECTION_NORTHWEST);
                else if (secondToLastKey === KEYCODE_RIGHT) this.changeDirection(DIRECTION_NORTHEAST);
                else this.changeDirection(DIRECTION_NORTH);

                this.walk();
                break;
            case KEYCODE_DOWN:
                if (secondToLastKey === KEYCODE_LEFT) this.changeDirection(DIRECTION_SOUTHWEST);
                else if (secondToLastKey === KEYCODE_RIGHT) this.changeDirection(DIRECTION_SOUTHEAST);
                else this.changeDirection(DIRECTION_SOUTH);

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

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Wall':
                this.updatePosition(
                    this.x - this.signX * ((collision.height >= this.speed) ? collision.width : 0),
                    this.y - this.signY * ((collision.width >= this.speed) ? collision.height : 0));

                this.signX = 0;
                this.signY = 0;
                break;
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
    this.type = 'Player';
    this.speed = 3;
    this.construct();
    this.emit('join');
}

function OpponentGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        switch (this.animation) {
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
        if (Math.sqrt(Math.pow(this.x-this.startx, 2) + Math.pow(this.y-this.starty, 2)) <= this.distance) {
            this.check();
            this.move();
        } else {
            this.destruct();
        }
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Wall': console.log('Projectile colliding with Wall'); this.destruct(); break;
            case 'Character': console.log('Projectile colliding with Character'); this.destruct(); break;
        }
    };

    this.type = 'Projectile';
    this.startx = x;
    this.starty = y;
    this.distance = 100;
    this.changeDirection(direction);
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

    this.type = 'Wall';
    this.data = {
        images: ['./assets/brickwall.png'],
        frames: {width: 64, height: 64, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
    };
    this.construct();
}

function resizeGame() {
    const gameField = document.getElementById('game-field');
    const gameWindow = document.getElementById('game-window');
    gameField.width = gameWindow.clientWidth;
    gameField.height = gameWindow.clientHeight;
}

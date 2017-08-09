setTimeout(() => { startGame() });

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

var data = {
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

var spriteSheet = new createjs.SpriteSheet(data);
var guy = new createjs.Sprite(spriteSheet, "idle");
guy.idling = true;
guy.x = 10;
guy.y = 10;

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

    rectangle = new createjs.Shape();
    rectangle.graphics.beginFill("#ff0000").drawRect(50, 50, 50, 50);     // x, y, width, height


    gameStage.addChild(circle);
    gameStage.addChild(rectangle);
    gameStage.addChild(guy);
    gameStage.update();

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
var movespeed = 3;

function keyPressed(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            if(guy.idling) {
                guy.gotoAndPlay("walk");
            }
            guy.idling = false;
            guy.x -= movespeed;
            break;
        case KEYCODE_RIGHT:
            if(guy.idling) {
                guy.gotoAndPlay("walk");
            }
            guy.idling = false;
            guy.x += movespeed;
            break;
        case KEYCODE_UP:
            if(guy.idling) {
                guy.gotoAndPlay("walk");
            }
            guy.idling = false;
            guy.y -= movespeed;
            break;
        case KEYCODE_DOWN:
            if(guy.idling) {
                guy.gotoAndPlay("walk");
            }
            guy.idling = false;
            guy.y += movespeed;
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

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick(event) {
    // Actions carried out each tick (aka frame)
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
        bullet.x += 5;
        gameStage.update();
    }
}

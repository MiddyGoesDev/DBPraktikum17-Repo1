setTimeout(() => { startGame() });

var rectangle;
var gameStage;
var circle;

var data = {
    images: ['./assets/sprites.png'],
    frames: [
        // x, y, width, height, imageIndex*, regX*, regY*
        [16, 16, 16, 16]
        // etc.
    ],
    animations: {
        stand: 0
    }
    /*frames: {width:16, height:16, regX: 32, regY:64, spacing:0, margin:0},

    animations: {
        stand:0,
        run:[1,1],
        jump:[6,8,"run"]
    }*/
};
var spriteSheet = new createjs.SpriteSheet(data);
var guy = new createjs.Sprite(spriteSheet, "stand");

function startGame() {
    gameStage = new createjs.Stage('gameField');

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
}

const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;

function keyPressed(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            guy.x -= 10;
            break;
        case KEYCODE_RIGHT:
            guy.x += 10;
            break;
        case KEYCODE_UP:
            guy.y -= 10;
            break;
        case KEYCODE_DOWN:
            guy.y += 10;
            break;
    }
    gameStage.update();
}




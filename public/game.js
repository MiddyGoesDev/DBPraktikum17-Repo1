
setTimeout(() => { startGame() });

var rectangle;
var gameStage;
var circle;

function startGame() {

    console.log(document.getElementById('gameField'));

    gameStage = new createjs.Stage('gameField');

    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(100, 100, 10);
    circle.x = 100;
        circle.y = 50;

    rectangle = new createjs.Shape();
    rectangle.graphics.beginFill("#ff0000").drawRect(50, 50, 100, 100);

    gameStage.addChild(circle);
    gameStage.addChild(rectangle);
    gameStage.update();

    document.onkeydown = keyPressed;
}

var KEYCODE_LEFT = 37,
    KEYCODE_RIGHT = 39,
    KEYCODE_UP = 38,
    KEYCODE_DOWN = 40;

function keyPressed(event) {
    switch(event.keyCode) {
        case KEYCODE_LEFT:
            rectangle.x -= 10;
            break;
        case KEYCODE_RIGHT:
            rectangle.x += 10;
            break;
        case KEYCODE_UP:
            rectangle.y -= 10;
            break;
        case KEYCODE_DOWN:
            rectangle.y += 10;
            break;
    }
    gameStage.update();
}

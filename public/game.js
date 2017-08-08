

function startGame() {
    console.log(document.getElementById('gameField'));

    var gameStage = new createjs.Stage('gameField');

    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    circle.x = circle.y = 50;

    gameStage.addChild(circle);
    gameStage.update();
}
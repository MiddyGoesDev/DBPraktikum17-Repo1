
setTimeout(() => { startGame() });

function startGame() {

    console.log(document.getElementById('gameField'));

    var gameStage = new createjs.Stage('gameField');

    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(100, 100, 10);
    circle.x = 100;
        circle.y = 50;

    var shape = new createjs.Shape();
    shape.graphics.beginFill("#ff0000").drawRect(50, 50, 100, 100);

    gameStage.addChild(circle);
    gameStage.addChild(shape);
    gameStage.update();
}
import GameStage from './GameStage'

export function HpBar() {
    this.bar = new window.createjs.Shape();
    this.bar.graphics.beginFill("red").drawRect(0, 0, 10, 2);
    return this.bar;
}

export function updateBarPosition(object) {
    let bar = object.hpBar;
    let size =  Math.ceil(object.hp / 10);
    bar.graphics.command.x = object.x + object.width / 2  - size / 2;
    bar.graphics.command.y = object.y - 4;
}

export function updateBarHealth (object) {
    let bar = object.hpBar;
    let size = Math.ceil(object.hp / 10);
    bar.graphics.command.w = size;
    updateBarPosition(object);
    GameStage().stage.addChild(bar);

}





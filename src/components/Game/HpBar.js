import GameStage from './GameStage'

export function HpBar(object) {

    let x = object.x;
    let y = object.y;
    let currentHP = object.hp;
    this.bar = new window.createjs.Shape();
    this.bar.graphics.beginFill("red").drawRect(x + 2, y - 10, 10, 2);
    this.bar.graphics.command.w = Math.ceil(currentHP / 10);
    return this.bar;
}

export function updateBar(object) {
    let size = Math.ceil(object.hp / 10);
    let bar = object.hpBar;
    bar.graphics.command.w = size;
    GameStage().stage.addChild(bar);
}





import GameStage from './GameStage'

export default function HpBar() {

    this.construct = () => {
        this.bar = new window.createjs.Shape();
        this.bar.graphics.beginFill("red").drawRect(0, 0, 10, 2);
    };

    this.size = (object) => {
        return Math.ceil(object.hp / 10);
    };

    this.updatePosition = (object) => {
        this.bar.graphics.command.x = object.x + object.width / 2  - this.size(object) / 2;
        this.bar.graphics.command.y = object.y - 4;
    };

    this.updateHealth = (object) => {
        this.bar.graphics.command.w = this.size(object);
        this.updatePosition(object);
        GameStage().stage.addChild(this.bar);
    };

    this.type = 'HpBar';
    this.bar = null;
    this.construct();
}
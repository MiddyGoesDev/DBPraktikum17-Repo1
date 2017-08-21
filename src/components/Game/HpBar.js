import GameStage from './GameStage'

export default function HpBar(object) {

    this.construct = () => {
        this.bar = new window.createjs.Shape();
        this.bar.graphics.beginFill("red").drawRect(0, 0, 10, 2);
        this.object = object;
    };
    
    this.isFull = () => {
        return this.object.maxHP() === this.object.currentHP;
    };
    
    this.size = () => {
        return Math.ceil(Math.max(this.object.currentHP, 0) / 10);
    };

    this.updatePosition = () => {
        this.bar.graphics.command.x = this.object.x + this.object.width / 2  - this.size() / 2;
        this.bar.graphics.command.y = this.object.y - 4;
    };

    this.updateHealth = () => {
        this.bar.graphics.command.w = this.size();
        this.updatePosition();
        if (!this.isFull()) {
            this.displayHealth();
        } else if (this.isFull() || this.size()===0) {
            this.hideHealth();
        }
    };

    this.displayHealth = () => {
        GameStage().draw(this.bar);
    };

    this.hideHealth = () => {
        GameStage().erase(this.bar);
    };

    this.type = 'HpBar';
    this.bar = null;
    this.object = null;
    this.name = null;
    this.construct();
}
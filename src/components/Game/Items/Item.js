import GameObject from '../GameObject';
import HpBar from "../HpBar";
import GameStage from "../GameStage";

export default function Item() {

    GameObject.call(this, 0, 0);

    this.construct = () => {
        this.data.framerate = 25;
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.currentHP = this.baseHP;
        this.hpBar = new HpBar(this);
    };

    this.update = () => { };

    this.drop = (x, y) => {
        this.x = x;
        this.y = y;
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Player':
                if (this.type === 'main_hand') {
                    object.weapon = this;
                }
                object.createBaqendItem(this);
                this.destruct();
            case 'Character':
                object.items.push(this);
                this.destruct();
            case 'Cow':
                this.destruct();
                break;
        }
    };

    this.type = 'Item';
    this.vitality = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
    this.movementSpeed = 0;
}

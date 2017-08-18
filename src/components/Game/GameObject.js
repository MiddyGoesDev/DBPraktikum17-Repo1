import { DIRECTION_SOUTH, directionName} from './Directions';
import GameStage from './GameStage';
import { HpBar, updateBarPosition, updateBarHealth } from './HpBar'


export default function GameObject(x, y) {

    this.construct = () => {
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.hpBar = new HpBar();
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    this.destruct = () => {
        GameStage().remove(this);
    };

    this.update = () => { };

    this.handleEvent = () => { };

    this.emit = (action) => {
        GameStage().socket.emit(action, {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
            animation: this.animation
        });
    };

    this.on = (action) => { };

    this.handleCollision = (object, collision) => { };

    this.check = () => {
        let near = GameStage().near(this);
        for (let i=0 ; i < near.length; i++) {
            let collision = this.checkCollision(near[i]);
            if (collision !== false) {
                this.handleCollision(near[i], collision);
            }
        }
    };

    this.move = () => {
        console.log('direction: x: ' + this.direction.x + ', y: ' + this.direction.y + ', name: ' + this.direction.name);
        this.updatePosition(this.x + this.direction.x * this.speed, this.y + this.direction.y * this.speed);
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
        updateBarPosition(this);
    };

    this.play = (animation) => {
        this.animation = animation;
        this.sprite.gotoAndPlay(this.animation + this.direction.name);
    };

    this.updateDirection = (destX, destY) => {
        this.direction.x = (destX - this.x) / Math.max(Math.abs(destX - this.x), 1);
        this.direction.y = (destY - this.y) / Math.max(Math.abs(destY - this.y), 1);
        this.direction.name = directionName(this.direction.x, this.direction.y);
    };

    this.directionChanged = (direction) => {
        return this.direction.name !== direction.name;
    };

    this.checkCollision = (object) => {
        return window.ndgmr.checkPixelCollision(this.sprite, object.sprite, 0.01, true);
    };

    this.spriteSheet = (x, y) => {
        let frames = [];
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push([this.width * i, this.height * j, this.width, this.height]);
            }
        }
        return frames;
    };

    this.takeDamage = (damage) => {
      this.hp -= Math.max(0 , damage - this.armor);
      updateBarHealth(this);
      if (this.hp <= 0) {
          this.destruct();
      }
    };

    this.type = 'GameObject';
    this.id = Math.floor(new Date().valueOf() * Math.random());
    this.x = x;
    this.y = y;
    this.height = 0;
    this.width = 0;
    this.data = null;
    this.sprite = null;
    this.animation = null;
    this.direction = Object.assign({}, DIRECTION_SOUTH);
    this.speed = 0;
    this.armor = 0;
    this.hp = 100;
    this.hpBar = null;
    this.keyChanged = false;
}

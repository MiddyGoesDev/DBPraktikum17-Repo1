import { DIRECTION_SOUTH, directionName} from './Directions';
import GameStage from './GameStage';

export default function GameObject(x, y) {

    this.construct = () => {
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    this.destruct = () => {
        GameStage().remove(this);
    };

    this.update = () => { };

    this.handleEvent = () => { };

    this.emit = (action) => {
        console.log('emit ' + action);
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
        for (let i=0; i<near.length; i++) {
            let collision = this.checkCollision(near[i]);
            if (collision !== false) {
                this.handleCollision(near[i], collision);
            }
        }
    };

    this.move = () => {
        this.updatePosition(this.x + this.direction.x * this.speed, this.y + this.direction.y * this.speed);
        if (this.hpBar !== null && this.hpBar !== undefined)
        {
            this.hpBar.graphics.command.x = this.x + 2;
            this.hpBar.graphics.command.y = this.y - 2;
        }
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
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
        return this.direction !== direction;
    };

    this.checkCollision = (object) => {
        return window.ndgmr.checkPixelCollision(this.sprite, object.sprite, 0.01, true);
    };

    this.spriteSheet = (x, y, size) => {
        let frames = [];
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push([size * i, size * j, size, size]);
            }
        }
        return frames;
    };

    this.type = 'GameObject';
    this.id = Math.floor(new Date().valueOf() * Math.random());
    this.x = x;
    this.y = y;
    this.data = null;
    this.sprite = null;
    this.animation = null;
    this.direction = DIRECTION_SOUTH;
    this.speed = 0;
    this.armor = 0;
    this.hp = 1;
    this.keyChanged = false;

}

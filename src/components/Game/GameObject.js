import {DIRECTION_SOUTH, directionName} from './Constants/Directions';
import GameStage from './GameStage';
import HpBar from './HpBar';


export default function GameObject(x, y) {

    this.construct = () => {
        this.data.framerate = 25;
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.currentHP = this.baseHP;
        this.hpBar = new HpBar(this);
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    this.destruct = () => {
        GameStage().erase(this.text);
        GameStage().erase(this.hpBar.bar);
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
            animation: this.animation,
            currentHP: this.currentHP
        });
    };

    this.handleCollision = (object, collision) => { };

    this.check = () => {
        let near = GameStage().near(this);
        for (let i = 0; i < near.length; i++) {
            let collision = this.checkCollision(near[i]);
            if (collision !== false) {
                this.handleCollision(near[i], collision);
            }
        }
    };

    this.checkCollision = (object) => {
        // TODO: pixelPerfect collision not working reliably
        return window.ndgmr.checkPixelCollision(this.sprite, object.sprite, 0, true);
    };

    this.play = (animation) => {
        this.animation = animation;
        this.sprite.gotoAndPlay(this.animation + this.direction.name);
    };

    this.move = () => {
        this.updatePosition(this.x + this.direction.x * this.speed, this.y + this.direction.y * this.speed);
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
        this.hpBar.updatePosition(this);
        this.updateText(x, y);
    };

    this.push = (x, y, direction) => {

    };

    this.updateText = (x, y) => {

    };

    this.updateDirection = (destX, destY) => {
        this.direction.x = (destX - this.x) / Math.max(Math.abs(destX - this.x), 1);
        this.direction.y = (destY - this.y) / Math.max(Math.abs(destY - this.y), 1);
        this.direction.name = directionName(this.direction.x, this.direction.y);
    };

    this.directionChanged = (direction) => {
        return this.direction.name !== direction.name;
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

    this.takeDamage = (object) => {
        this.currentHP -= Math.max(0, object.damage - this.armor);
        this.hpBar.updateHealth();
        if (this.currentHP <= 0) {
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
    this.baseHP = 100;
    this.currentHP = 100;
    this.maxHP = () => this.baseHP;
    this.hpBar = null;
    this.keyChanged = false;
}

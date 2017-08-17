import { DIRECTION_SOUTH, DIRECTION_NORTH, DIRECTION_EAST, DIRECTION_WEST,
    DIRECTION_NORTHEAST, DIRECTION_NORTHWEST, DIRECTION_SOUTHEAST, DIRECTION_SOUTHWEST} from './Directions';
import GameStage from './GameStage';

export default function GameObject(x, y) {

    this.construct = () => {
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        GameStage().add(this);
        this.updatePosition(this.x, this.y);
    };

    this.destruct = () => {
        GameStage().remove(this);
    };

    this.update = () => { };

    this.handleEvent = () => { };

    this.emit = (action) => {
        switch (action) {
            case 'change':


        }
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

    let i = 0;
    this.move = () => {
        console.log(GameStage().gameObjects);
        console.log(i++);
        this.updatePosition(this.x + this.signX * this.speed, this.y + this.signY * this.speed);
    };

    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    };

    this.updateSign = () => {
        this.signX = 0; this.signY = 0;

        switch (this.direction) {
            case DIRECTION_NORTH:     this.signY = -1; break;
            case DIRECTION_NORTHEAST: this.signY = -1;
            case DIRECTION_EAST:      this.signX = 1; break;
            case DIRECTION_SOUTHEAST: this.signX = 1;
            case DIRECTION_SOUTH:     this.signY = 1; break;
            case DIRECTION_SOUTHWEST: this.signY = 1;
            case DIRECTION_WEST:      this.signX = -1; break;
            case DIRECTION_NORTHWEST: this.signX = -1; this.signY = -1;
        }
    };

    this.play = (animation) => {
        this.animation = animation;
        switch (this.direction) {
            case DIRECTION_NORTH: this.sprite.gotoAndPlay(animation + 'North'); break;
            case DIRECTION_NORTHEAST: this.sprite.gotoAndPlay(animation + 'NorthEast'); break;
            case DIRECTION_EAST: this.sprite.gotoAndPlay(animation + 'East'); break;
            case DIRECTION_SOUTHEAST: this.sprite.gotoAndPlay(animation + 'SouthEast'); break;
            case DIRECTION_SOUTH: this.sprite.gotoAndPlay(animation + 'South'); break;
            case DIRECTION_SOUTHWEST: this.sprite.gotoAndPlay(animation + 'SouthWest'); break;
            case DIRECTION_WEST: this.sprite.gotoAndPlay(animation + 'West'); break;
            case DIRECTION_NORTHWEST: this.sprite.gotoAndPlay(animation + 'NorthWest'); break;
        }
    };

    this.changeDirection = (direction) => {
        this.direction = direction;
        this.updateSign();
    };

    this.directionChanged = (direction) => {
        return this.direction !== direction;
    };

    this.checkCollision = (object) => {
        return window.ndgmr.checkPixelCollision(this.sprite, object.sprite, 0.01, true);
    };

    this.spriteSheet = (x, y) => {
        let frames = [];
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push([16*i, 16*j, 16, 16]);
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
    this.signX = 0;
    this.signY = 0;
    this.direction = null;
    this.changeDirection(DIRECTION_SOUTH);
    this.speed = 0;
    this.armor = 0;
    this.hp = 1;
}

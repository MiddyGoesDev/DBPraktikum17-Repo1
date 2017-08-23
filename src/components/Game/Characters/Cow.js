import GameStage from '../GameStage';
import Character from './Character';

export default function Cow(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (this.destX !== Math.round(this.x) || this.destY !== Math.round(this.y)) {
            let direction = this.direction;
            this.updateDirection(this.destX, this.destY);
            let distance = Math.sqrt(Math.pow(Math.abs(this.destX - this.x), 2) + Math.pow(Math.abs(this.destY - this.y), 2));
            this.speed =  distance < this.speed ? distance : 3;
            this.move();
            this.check();
            if (this.directionChanged(direction) || !this.isWalking()) {
                this.walk();
            }
        } else {
            this.idle();
            this.direction = this.destDirection;
        }
    };

    this.emit = (action) => {
        GameStage().socket.emit(action, {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
            animation: this.animation,
            currentHP: this.currentHP,
            hitter: this.hitter,
        });
    };

    this.takeDamage = (object) => {
            this.currentHP -= Math.max(0, object.damage - this.armor);
            this.hpBar.updateHealth();
            this.hitter = object.owner;
            if (this.currentHP <= 0) {
                this.destruct();
                this.emit('cow died');
            } else {
                this.emit('hit cow');
            }
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Player': 
                object.takeDamage(this);
                let tempDirection = object.direction;
                object.direction = this.direction;
                object.move();
                object.check();
                object.emit('change');
                object.direction = tempDirection;
                break;
        }
    };

    this.destruct = () => {
        GameStage().remove(this);
    };

    this.height = 32;
    this.width = 32;

    this.data = {
        images: ['./assets/cow.png'],
        frames: this.spriteSheet(4, 8),
        animations: {
            walkEast: [8, 11, 'walkEast', 0.3],
            walkNorthEast: [8, 11, 'walkNorthEast', 0.3],
            walkSouthEast: [8, 11, 'walkSouthEast', 0.3],
            walkWest: [4, 7, 'walkWest', 0.3],
            walkNorthWest: [4, 7, 'walkNorthWest', 0.3],
            walkSouthWest: [4, 7, 'walkSouthWest', 0.3],
            walkNorth: [0, 3, 'walkNorth', 0.3],
            walkSouth: [12, 15, 'walkSouth', 0.3],
            idleEast: [28, 31, 'idleEast', 0.1],
            idleNorthEast: [28, 31, 'idleNorthEast', 0.1],
            idleSouthEast: [28, 31, 'idleSouthEast', 0.1],
            idleWest: [20, 23, 'idleWest', 0.1],
            idleNorthWest: [20, 23, 'idleNorthWest', 0.1],
            idleSouthWest: [20, 23, 'idleSouthWest', 0.1],
            idleNorth: [16, 19, 'idleNorth', 0.1],
            idleSouth: [24, 27, 'idleSouth', 0.1]
        }
    };

    this.type = 'Cow';
    this.damage = 1;
    this.killer = null;
    this.speed = 3;
    this.construct();
    this.destX = this.x;
    this.destY = this.y;
    this.destDirection = this.direction;
}
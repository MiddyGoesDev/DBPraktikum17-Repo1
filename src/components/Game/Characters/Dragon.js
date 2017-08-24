import GameStage from '../GameStage';
import Character from './Character';

export default function Dragon(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (this.destX !== Math.round(this.x) || this.destY !== Math.round(this.y)) {
            let direction = this.direction;
            this.updateDirection(this.destX, this.destY);
            let distance = Math.sqrt(Math.pow(Math.abs(this.destX - this.x), 2) + Math.pow(Math.abs(this.destY - this.y), 2));
            this.speed =  distance < this.speed ? distance : 4;
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
                for(var i = 0; i < 3; i++) {
                    object.move();
                    object.check();
                }
                object.emit('change');
                object.direction = tempDirection;
                break;
        }
    };

    this.destruct = () => {
        GameStage().remove(this);
    };

    this.height = 48;
    this.width = 64;

    this.data = {
        images: ['./assets/dragon.png'],
        frames: this.spriteSheet(1, 5),
        animations: {
            walkEast: [0, 4, 'walkEast', 0.35],
            walkNorthEast: [0, 4, 'walkNorthEast', 0.35],
            walkSouthEast: [0, 4, 'walkSouthEast', 0.35],
            walkWest: [0, 4, 'walkWest', 0.35],
            walkNorthWest: [0, 4, 'walkNorthWest', 0.35],
            walkSouthWest: [0, 4, 'walkSouthWest', 0.35],
            walkNorth: [0, 4, 'walkNorth', 0.35],
            walkSouth: [0, 4, 'walkSouth', 0.35],
            idleEast: [0, 4, 'idleEast', 0.35],
            idleNorthEast: [0, 4, 'idleNorthEast', 0.35],
            idleSouthEast: [0, 4, 'idleSouthEast', 0.35],
            idleWest: [0, 4, 'idleWest', 0.35],
            idleNorthWest: [0, 4, 'idleNorthWest', 0.35],
            idleSouthWest: [0, 4, 'idleSouthWest', 0.35],
            idleNorth: [0, 4, 'idleNorth', 0.35],
            idleSouth: [0, 4, 'idleSouth', 0.35]
        }
    };

    this.type = 'Cow';
    this.damage = 50;
    this.hitter = null;
    this.speed = 4;
    this.construct();
    this.destX = this.x;
    this.destY = this.y;
    this.destDirection = this.direction;
}
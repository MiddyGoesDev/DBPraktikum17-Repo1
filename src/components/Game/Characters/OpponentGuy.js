import Character from './Character';
import Text from '../Text';
import GameStage from "../GameStage";

export default function OpponentGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        switch (this.nextAnimation) {
            case 'idle': this.idle(); break;
            case 'punch': this.play('punch'); break;
            case 'walk':
                if (this.directionChanged(this.nextDirection) || !this.isWalking()) {
                    this.direction = this.nextDirection;
                    this.walk();
                }
                break;
        }
        if (!this.isBusy() && this.isWalking()) {
            this.move();
            this.check();
        }
    };

    this.rename = (name) => {
        this.name = name;
        this.text.text = name;
    };

    this.updateText = (x, y) => {
        this.text.x = x - 8;
        this.text.y = y - 18;
    };

    this.respawn = (timeout) => {
        setTimeout(() => {
            this.heal(this.maxHP());
            this.updatePosition(this.spawnX, this.spawnY);
            GameStage().add(this);
            this.hpBar.updateHealth();
            GameStage().draw(this.text);
        }, timeout);
    };


    this.height = 16;
    this.width = 16;

    this.data = {
        images: ['./assets/guyRed.png'],
        frames: this.spriteSheet(4, 32),
        animations: {
            walkEast: [8*4, 8*4+2, 'walkEast', 0.3],
            walkWest: [9*4, 9*4+2, 'walkWest', 0.3],
            walkNorth: [10*4, 10*4+3, 'walkNorth', 0.3],
            walkSouth: [11*4, 11*4+3, 'walkSouth', 0.3],
            walkNorthEast: [12*4, 12*4+3, 'walkNorthEast', 0.3],
            walkNorthWest: [13*4, 13*4+3, 'walkNorthWest', 0.3],
            walkSouthEast: [14*4, 14*4+2, 'walkSouthEast', 0.3],
            walkSouthWest: [15*4, 15*4+2, 'walkSouthWest', 0.3],
            idleEast: [0, 3, 'idleEast', 0.25],
            idleWest: [4, 4+3, 'idleWest', 0.25],
            idleNorth: [2*4, 2*4+3, 'idleNorth', 0.25],
            idleSouth: [3*4, 3*4+3, 'idleSouth', 0.25],
            idleNorthEast: [4*4, 4*4+3, 'idleNorthEast', 0.25],
            idleNorthWest: [5*4, 5*4+3, 'idleNorthWest', 0.25],
            idleSouthEast: [7*4, 7*4+3, 'idleSouthEast', 0.25],
            idleSouthWest: [6*4, 6*4+3, 'idleSouthWest', 0.25],
            punchEast: [16*4, 16*4+2, 'idleEast', 0.5],
            punchWest: [17*4, 17*4+2, 'idleWest', 0.5],
            punchNorth: [18*4, 18*4+2, 'idleNorth', 0.5],
            punchSouth: [19*4, 19*4+2, 'idleSouth', 0.5],
            punchNorthEast: [20*4, 20*4+2, 'idleNorthEast', 0.5],
            punchNorthWest: [21*4, 21*4+2, 'idleNorthWest', 0.5],
            punchSouthEast: [23*4, 23*4+2, 'idleSouthEast', 0.5],
            punchSouthWest: [22*4, 22*4+2, 'idleSouthWest', 0.5],
            runningKick: [0, 3, 'idle', 0.25]
        }
    };

    this.nextAnimation = null;
    this.nextDirection = null;
    this.name = 'Tim';
    this.text = new Text(this.name, this.x, this.y, 0.5, 0.4);

    GameStage().draw(this.text);
    this.construct();
    this.idle();
}

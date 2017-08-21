import Character from './Character';
import GameStage from '../GameStage';

import {KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT, KEYCODE_S, KEYCODE_1} from '../Constants/KeyCodes';
import {
    DIRECTION_SOUTH, DIRECTION_NORTH, DIRECTION_EAST, DIRECTION_WEST,
    DIRECTION_NORTHEAST, DIRECTION_NORTHWEST, DIRECTION_SOUTHEAST, DIRECTION_SOUTHWEST
} from '../Constants/Directions';

export default function PlayerGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (!this.isBusy() && this.isWalking()) {
            this.move();
            this.check();
        }
    };

    this.updateBaqend = () => {
        this.character.x = this.x;
        this.character.y = this.y;
        this.character.direction = this.direction;
        this.character.animation = this.animation;
        if(this.character._metadata.isReady) {
            this.character.update({force: true});

        }
    };

    // TODO: refactor this! use math
    this.handleEvent = () => {
        let lastKey = GameStage().activeKeys[GameStage().activeKeys.length - 1];
        let secondToLastKey = GameStage().activeKeys[GameStage().activeKeys.length - 2];
        let direction = this.direction;
        switch (lastKey) {
            case KEYCODE_LEFT:
                if (secondToLastKey === KEYCODE_UP) this.direction = DIRECTION_NORTHWEST;
                else if (secondToLastKey === KEYCODE_DOWN) this.direction = DIRECTION_SOUTHWEST;
                else this.direction = DIRECTION_WEST;

                if (this.directionChanged(direction) || !this.isWalking()) {
                    this.walk();
                    this.emit('change');
                }
                break;
            case KEYCODE_RIGHT:
                if (secondToLastKey === KEYCODE_UP) this.direction = DIRECTION_NORTHEAST;
                else if (secondToLastKey === KEYCODE_DOWN) this.direction = DIRECTION_SOUTHEAST;
                else this.direction = DIRECTION_EAST;

                if (this.directionChanged(direction) || !this.isWalking()) {
                    this.walk();
                    this.emit('change');
                }
                break;
            case KEYCODE_UP:
                if (secondToLastKey === KEYCODE_LEFT) this.direction = DIRECTION_NORTHWEST;
                else if (secondToLastKey === KEYCODE_RIGHT) this.direction = DIRECTION_NORTHEAST;
                else this.direction = DIRECTION_NORTH;

                if (this.directionChanged(direction) || !this.isWalking()) {
                    this.walk();
                    this.emit('change');
                }
                break;
            case KEYCODE_DOWN:
                if (secondToLastKey === KEYCODE_LEFT) this.direction = DIRECTION_SOUTHWEST;
                else if (secondToLastKey === KEYCODE_RIGHT) this.direction = DIRECTION_SOUTHEAST;
                else this.direction = DIRECTION_SOUTH;



                if (this.directionChanged(direction) || !this.isWalking()) {
                    this.walk();
                    this.emit('change');
                }
                break;
            case KEYCODE_S:
                this.punch();
                this.emit('change');
                break;
            case KEYCODE_1:
                // TODO type
                if (this.items.filter(item => item.type === 'Item').length !== 0){
                   this.use();
                }
                this.emit('change');
                break;
            default:
                this.idle();
                this.emit('change');
                this.updateBaqend();
        }
    };

    this.height = 16;
    this.width = 16;

    this.data = {
        images: ['./assets/guyGreen.png'],
        frames: this.spriteSheet(4, 32),
        animations: {
            walkEast: [8 * 4, 8 * 4 + 2, 'walkEast', 0.3],
            walkWest: [9 * 4, 9 * 4 + 2, 'walkWest', 0.3],
            walkNorth: [10 * 4, 10 * 4 + 3, 'walkNorth', 0.3],
            walkSouth: [11 * 4, 11 * 4 + 3, 'walkSouth', 0.3],
            walkNorthEast: [12 * 4, 12 * 4 + 3, 'walkNorthEast', 0.3],
            walkNorthWest: [13 * 4, 13 * 4 + 3, 'walkNorthWest', 0.3],
            walkSouthEast: [14 * 4, 14 * 4 + 2, 'walkSouthEast', 0.3],
            walkSouthWest: [15 * 4, 15 * 4 + 2, 'walkSouthWest', 0.3],
            idleEast: [0, 3, 'idleEast', 0.25],
            idleWest: [4, 4 + 3, 'idleWest', 0.25],
            idleNorth: [2 * 4, 2 * 4 + 3, 'idleNorth', 0.25],
            idleSouth: [3 * 4, 3 * 4 + 3, 'idleSouth', 0.25],
            idleNorthEast: [4 * 4, 4 * 4 + 3, 'idleNorthEast', 0.25],
            idleNorthWest: [5 * 4, 5 * 4 + 3, 'idleNorthWest', 0.25],
            idleSouthEast: [7 * 4, 7 * 4 + 3, 'idleSouthEast', 0.25],
            idleSouthWest: [6 * 4, 6 * 4 + 3, 'idleSouthWest', 0.25],
            punchEast: [16 * 4, 16 * 4 + 2, 'idleEast', 0.5],
            punchWest: [17 * 4, 17 * 4 + 2, 'idleWest', 0.5],
            punchNorth: [18 * 4, 18 * 4 + 2, 'idleNorth', 0.5],
            punchSouth: [19 * 4, 19 * 4 + 2, 'idleSouth', 0.5],
            punchNorthEast: [20 * 4, 20 * 4 + 2, 'idleNorthEast', 0.5],
            punchNorthWest: [21 * 4, 21 * 4 + 2, 'idleNorthWest', 0.5],
            punchSouthEast: [23 * 4, 23 * 4 + 2, 'idleSouthEast', 0.5],
            punchSouthWest: [22 * 4, 22 * 4 + 2, 'idleSouthWest', 0.5],
            runningKick: [0, 3, 'idle', 0.25]
        }
    };

    this.character = null;

    this.construct();
    this.emit('join');
    this.idle();
    this.takeDamage(0); //activate HP bar
}
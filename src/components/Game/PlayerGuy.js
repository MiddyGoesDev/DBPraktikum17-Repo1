import Character from './Character';
import getStage from './GameStage';

import { KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT, KEYCODE_S } from './KeyCodes';
import { DIRECTION_SOUTH, DIRECTION_NORTH, DIRECTION_EAST, DIRECTION_WEST,
    DIRECTION_NORTHEAST, DIRECTION_NORTHWEST, DIRECTION_SOUTHEAST, DIRECTION_SOUTHWEST} from './Directions';

export default function PlayerGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        if (!this.isBusy() && this.isWalking()) {
            this.move();
            this.check();
            this.emit('change');
        }
    };

    this.emit = (action) => {
        // var player = DB.Opponent.find().equal('id', DB.User.me.id);
        // player.playing = true;
        // player.update();
    };

    this.handleEvent = () => {
        let lastKey = getStage().activeKeys[getStage().activeKeys.length -1];
        let secondToLastKey = getStage().activeKeys[getStage().activeKeys.length -2];
        switch (lastKey) {
            case KEYCODE_LEFT:
                if (secondToLastKey === KEYCODE_UP) this.changeDirection(DIRECTION_NORTHWEST);
                else if (secondToLastKey === KEYCODE_DOWN) this.changeDirection(DIRECTION_SOUTHWEST);
                else this.changeDirection(DIRECTION_WEST);

                this.walk();
                break;
            case KEYCODE_RIGHT:
                if (secondToLastKey === KEYCODE_UP) this.changeDirection(DIRECTION_NORTHEAST);
                else if (secondToLastKey === KEYCODE_DOWN) this.changeDirection(DIRECTION_SOUTHEAST);
                else this.changeDirection(DIRECTION_EAST);

                this.walk();
                break;
            case KEYCODE_UP:
                if (secondToLastKey === KEYCODE_LEFT) this.changeDirection(DIRECTION_NORTHWEST);
                else if (secondToLastKey === KEYCODE_RIGHT) this.changeDirection(DIRECTION_NORTHEAST);
                else this.changeDirection(DIRECTION_NORTH);

                this.walk();
                break;
            case KEYCODE_DOWN:
                if (secondToLastKey === KEYCODE_LEFT) this.changeDirection(DIRECTION_SOUTHWEST);
                else if (secondToLastKey === KEYCODE_RIGHT) this.changeDirection(DIRECTION_SOUTHEAST);
                else this.changeDirection(DIRECTION_SOUTH);

                this.walk();
                break;
            case KEYCODE_S:
                this.punch();
                this.emit('change');
                break;
            default:
                this.idle();
                this.emit('change');
        }
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Wall':
                this.updatePosition(
                    this.x - this.signX * ((collision.height >= this.speed) ? collision.width : 0),
                    this.y - this.signY * ((collision.width >= this.speed) ? collision.height : 0));

                this.signX = 0;
                this.signY = 0;
                break;
        }
    };

    let frames = [];
    for (let j = 0; j < 18; j++) {
        for (let i = 0; i < 12; i++) {
            frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.data = {
        images: ['./assets/sprites.png'],
        frames: frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2, "walk", 0.3],
            idle: [6 * 12, 6 * 12 + 3, "idle", 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };
    this.type = 'Player';
    this.speed = 3;
    this.construct();
    this.emit('join');
}

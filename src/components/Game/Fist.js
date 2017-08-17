import Projectile from './Projectile';

export default function Fist(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.distance = 50;
    this.speed = 6;
    this.data = {
        images: ['./assets/fist.png'],
        frames: this.spriteSheet(4, 4),
        animations: {
            flyEast: [0, 0, 'flyEast', 2],
            flyWest: [1, 1, 'flyWest', 2],
            flyNorth: [3, 3, 'flyNorth', 3],
            flySouth: [2, 2, 'flySouth', 3],
            flyNorthEast: [6, 6, 'flyNorthEast', 3],
            flyNorthWest: [7, 7, 'flyNorthWest', 3],
            flySouthEast: [4, 4, 'flySouthEast', 3],
            flySouthWest: [5, 5, 'flySouthWest', 3]
        }
    };
    this.construct();
    this.play('fly');
}

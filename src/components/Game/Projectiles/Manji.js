import Projectile from './Projectile';

/**
 * A shuriken that flies a distance and deals damage to things in its path. Refer to Projectile for further details
 * @param x The x origin
 * @param y The y origin
 * @param direction The direction to fly towards
 */

export default function Manji(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.distance = 50;
    this.speed = 6;
    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            flyEast: [0, 1, 'flyEast', 1],
            flyWest: [0, 1, 'flyWest', 1],
            flyNorth: [0, 1, 'flyNorth', 1],
            flySouth: [0, 1, 'flySouth', 1],
            flyNorthEast: [1, 1, 'flyNorth', 1],
            flyNorthWest: [1, 1, 'flyNorth', 1],
            flySouthEast: [1, 1, 'flySouth', 1],
            flySouthWest: [1, 1, 'flySouth', 1]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.damage = 50;
    this.construct();
    this.play('fly');
}

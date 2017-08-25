import Projectile from './Projectile';

/**
 * A shuriken that flies a distance and deals damage to things in its path. Refer to Projectile for further details
 * @param x The x origin
 * @param y The y origin
 * @param direction The direction to fly towards
 */

export default function YagyuRyuYayuji(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.distance = 50;
    this.speed = 6;
    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            flyEast: [3, 4, 'flyEast', 1],
            flyWest: [3, 4, 'flyWest', 1],
            flyNorth: [3, 4, 'flyNorth', 1],
            flySouth: [3, 4, 'flySouth', 1],
            flyNorthEast: [4, 4, 'flyNorth', 1],
            flyNorthWest: [4, 4, 'flyNorth', 1],
            flySouthEast: [4, 4, 'flySouth', 1],
            flySouthWest: [4, 4, 'flySouth', 1]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.damage = 50;
    this.construct();
    this.play('fly');
}

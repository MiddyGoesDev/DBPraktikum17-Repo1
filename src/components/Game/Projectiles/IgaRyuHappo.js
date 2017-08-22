import Projectile from './Projectile';

export default function IgaRyuHappo(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.distance = 50;
    this.speed = 6;
    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            flyEast: [7, 8, 'flyEast', 1],
            flyWest: [7, 8, 'flyWest', 1],
            flyNorth: [7, 8, 'flyNorth', 1],
            flySouth: [7, 8, 'flySouth', 1],
            flyNorthEast: [8, 8, 'flyNorth', 1],
            flyNorthWest: [8, 8, 'flyNorth', 1],
            flySouthEast: [8, 8, 'flySouth', 1],
            flySouthWest: [8, 8, 'flySouth', 1]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.damage = 50;
    this.construct();
    this.play('fly');
}


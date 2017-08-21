import Projectile from './Projectile';

export default function KoboriRyuHorenGata(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.distance = 50;
    this.speed = 6;
    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            flyEast: [9, 10, 'flyEast', 1],
            flyWest: [9, 10, 'flyWest', 1],
            flyNorth: [9, 10, 'flyNorth', 1],
            flySouth: [9, 10, 'flySouth', 1],
            flyNorthEast: [10, 10, 'flyNorth', 1],
            flyNorthWest: [10, 10, 'flyNorth', 1],
            flySouthEast: [10, 10, 'flySouth', 1],
            flySouthWest: [10, 10, 'flySouth', 1]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.damage = 50;
    this.construct();
    this.play('fly');
}

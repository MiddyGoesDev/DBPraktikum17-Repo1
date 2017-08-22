import Item from './Item';
import Projectile from "../Projectiles/KoboriRyuHorenGata";

export default function KoboriRyuHorenGata(x, y) {

    Item.call(this, x, y);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            idleSouth: [11, 11, 'idleSouth', 0]
        }
    };

    this.use = (x, y, direction) => new Projectile(x, y, direction);

    this.hp = 1;
    this.armor = 10;
    this.type = 'main_hand';
    this.name = 'Kobori Ryu Horen Gata';
    this.construct();
    this.play('idle');

}



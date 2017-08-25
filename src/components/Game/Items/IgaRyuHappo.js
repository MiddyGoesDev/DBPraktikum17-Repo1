import Item from './Item';
import Projectile from "../Projectiles/IgaRyuHappo";

export default function IgaRyuHappo() {

    Item.call(this);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            idleSouth: [9, 9, 'idleSouth', 0]
        }
    };

    this.use = (x, y, direction) => new Projectile(x, y, direction);

    this.hp = 1;
    this.armor = 10;
    this.type = 'main_hand';
    this.name = 'Iga Ryu Happo';
    this.construct();
    this.play('idle');

}



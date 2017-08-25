import Item from './Item';
import Projectile from "../Projectiles/YagyuRyuYayuji";

export default function YagyuRyuYayuji() {

    Item.call(this);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            idleSouth: [5, 5, 'idleSouth', 0]
        }
    };

    this.use = (x, y, direction) => new Projectile(x, y, direction);

    this.hp = 1;
    this.armor = 10;
    this.type = 'main_hand';
    this.name = 'Yagyu Ryu Yayuji';
    this.construct();
    this.play('idle');

}


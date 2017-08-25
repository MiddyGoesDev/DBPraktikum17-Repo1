import Item from './Item';
import Projectile from "../Projectiles/IgaRyuHappo";

/**
 * A shuriken with unlimited uses. Refer to Item.js for further details
 */

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

    /**
     * Throws a shuriken toward a direction
     * @param x The x origin
     * @param y The y origin
     * @param direction The direction the projectile flies towards.
     */
    this.use = (x, y, direction) => new Projectile(x, y, direction);

    this.hp = 1;
    this.armor = 10;
    this.type = 'main_hand';
    this.name = 'Iga Ryu Happo';
    this.construct();
    this.play('idle');

}



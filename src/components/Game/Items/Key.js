import Item from './Item';

/**
 * A key to unlock locks with. Refer to Item.js for further details
 */

export default function Key() {

    Item.call(this);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/items/Key.png'],
        frames: this.spriteSheet(1, 1),
        animations: {
            idleSouth: [0, 0, 'idleSouth', 0]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.name = 'Key';
    this.construct();
    this.play('idle');

}

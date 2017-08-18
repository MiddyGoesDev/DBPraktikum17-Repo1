import Item from './Item';

export default function Shuriken(x, y) {

    Item.call(this, x, y);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 1),
        animations: {
            idleSouth: [2, 2, 'idleSouth', 0]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.construct();
    this.play('idle');

}

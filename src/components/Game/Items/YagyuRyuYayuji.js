import Item from './Item';

export default function YagyuRyuYayuji(x, y) {

    Item.call(this, x, y);

    this.height = 16;
    this.width = 16;
    this.data = {
        images: ['./assets/shuriken.png'],
        frames: this.spriteSheet(3, 7),
        animations: {
            idleSouth: [5, 5, 'idleSouth', 0]
        }
    };

    this.hp = 1;
    this.armor = 10;
    this.construct();
    this.play('idle');

}


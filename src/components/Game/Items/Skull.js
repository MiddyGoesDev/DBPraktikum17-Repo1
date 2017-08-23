import Item from './Item';

export default function Skull(x, y) {

    Item.call(this, x, y);

    this.height = 10;
    this.width = 10;
    this.data = {
        images: ['./assets/skull.png'],
        frames: this.spriteSheet(1, 1),
        animations: {
            idleSouth: [0, 0, 'idleSouth', 0]
        }
    };

    this.type = 'head';
    this.name = 'Steven\'s Skull';
    this.hp = 1;
    this.armor = 10;
    this.construct();
    this.play('idle');
}

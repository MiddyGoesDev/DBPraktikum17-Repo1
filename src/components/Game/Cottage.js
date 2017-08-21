import GameObject from './GameObject';

export default function Cottage(x, y) {

    GameObject.call(this, x, y);

    this.type = 'Wall';
    this.height = 128;
    this.width = 128;
    this.hp = 1000;
    this.data = {
        images: ['./assets/world.png'],
        frames: this.spriteSheet(2, 1),
        animations: {
            idleSouth: [1, 1, 'idleSouth', 0]
        }
    };

    this.construct();
    this.sprite.gotoAndStop('idleSouth');
}


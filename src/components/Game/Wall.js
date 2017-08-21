import GameObject from './GameObject';

export default function Wall(x, y) {

    GameObject.call(this, x, y);

    this.type = 'Wall';
    this.height = 64;
    this.width = 64;
    this.baseHP = 1000;
    this.data = {
        images: ['./assets/brickwall.png'],
        frames: {width: this.width, height: this.height, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
    };

    this.construct();
}

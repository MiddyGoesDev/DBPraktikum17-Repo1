import GameObject from './GameObject';

export default function Gate(x, y) {

    GameObject.call(this, x, y);

    this.type = 'Gate';
    this.height = 32;
    this.width = 80;
    this.baseHP = 1000;
    this.data = {
        images: ['./assets/gate.png'],
        frames: {width: this.width, height: this.height, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
    };

    this.construct();
}

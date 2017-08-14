import GameObject from './GameObject';

export default function Wall(x, y) {

    GameObject.call(this, x, y);

    this.type = 'Wall';
    this.data = {
        images: ['./assets/brickwall.png'],
        frames: {width: 64, height: 64, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
    };
    this.construct();
}

import Projectile from './Projectile';

export default function Bullet(x, y, direction) {

    Projectile.call(this, x, y, direction);

    this.speed = 6;
    this.data = {
        images: ['./assets/sprites.png'],
        frames: [[64, 80, 16, 16]]
    };
    this.construct();
}

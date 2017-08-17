import GameObject from './GameObject';
import Bullet from './Bullet';

export default function Character(x, y) {

    GameObject.call(this, x, y);

    this.idle = () => {
        if (!this.isIdling()) {
            this.play('idle');
        }
    };

    this.punch = () => {
        if (!this.isPunching()) {
            this.play('punch');
            new Bullet(this.x + this.signX * 5, this.y + this.signY * 5, this.direction);
        }
    };

    this.walk = () => {
        this.play('walk');
    };

    this.isBusy = () => {
        return this.isPunching();
    };

    this.isIdling = () => {
        return this.animation === 'idle';
    };

    this.isPunching = () => {
        return this.animation === 'punch';
    };

    this.isWalking = () => {
        return this.animation === 'walk';
    };

    this.type = 'Character';
    this.speed = 4;
    this.animation = null;
}

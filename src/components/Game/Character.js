import GameObject from './GameObject';
import Bullet from './Bullet';

export default function Character(x, y) {

    GameObject.call(this, x, y);

    this.idle = () => {
        if (!this.isIdling()) {
            this.sprite.gotoAndPlay('idle');
        }
    };

    this.punch = () => {
        if (!this.isPunching()) {
            this.sprite.gotoAndPlay('punch');
            new Bullet(this.x + this.signX * 5, this.y + this.signY * 5, this.direction);
        }
    };

    this.walk = () => {
        if (!this.isWalking()) {
            this.sprite.gotoAndPlay('walk');
        }
    };

    this.isBusy = () => {
        return this.isPunching();
    };

    this.isIdling = () => {
        return this.sprite.currentAnimation === 'idle';
    };

    this.isPunching = () => {
        return this.sprite.currentAnimation === 'punch';
    };

    this.isWalking = () => {
        return this.sprite.currentAnimation === 'walk';
    };

    this.type = 'Character';
    this.animation = 'idle';
}

import GameObject from './GameObject';

export default function Projectile(x, y, direction) {

    GameObject.call(this, x, y);

    this.update = () => {
        if (Math.sqrt(Math.pow(this.x-this.startx, 2) + Math.pow(this.y-this.starty, 2)) <= this.distance) {
            this.check();
            this.move();
        } else {
            this.destruct();
        }
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Wall': console.log('Projectile colliding with Wall'); this.destruct(); break;
            case 'Character': console.log('Projectile colliding with Character'); this.destruct(); break;
        }
    };

    this.type = 'Projectile';
    this.startx = x;
    this.starty = y;
    this.distance = 100;
    this.changeDirection(direction);
}

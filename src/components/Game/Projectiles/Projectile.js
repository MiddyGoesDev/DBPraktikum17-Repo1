import GameObject from '../GameObject';

export default function Projectile(x, y, direction) {

    GameObject.call(this, x, y);

    this.update = () => {
        if (Math.sqrt(Math.pow(this.x - this.startx, 2) + Math.pow(this.y - this.starty, 2)) <= this.distance) {
            this.check();
            this.move();
        } else {
            this.destruct();
        }
    };

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Gate': break;
            case 'CollisionMap': this.destruct(); break;
            default:
                if (object.id !== this.owner) {
                    object.takeDamage(this);
                    this.destruct();
                }
        }
    };

    this.owner = null;
    this.type = 'Projectile';
    this.startx = x;
    this.starty = y;
    this.distance = 100;
    this.damage = 5;
    this.direction = direction;
}

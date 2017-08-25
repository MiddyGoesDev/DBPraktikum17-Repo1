import GameObject from '../GameObject';

/**
 * A projectile that flies a distance and deals damage to things in its path. Breaks on impact
 * @param x The x origin
 * @param y The y origin
 * @param direction The direction to fly towards
 */

export default function Projectile(x, y, direction) {

    GameObject.call(this, x, y);


    /**
     * Destroys itself after a set distance or on impact.
     */
    this.update = () => {
        // if euclidean distance has not been travelled yes
        if (Math.sqrt(Math.pow(this.x - this.startx, 2) + Math.pow(this.y - this.starty, 2)) <= this.distance) {
            this.check(); // check collision
            this.move(); // then move
        } else {
            this.destruct();
        }
    };

    /**
     * Deals damage to objec
     * @param object
     * @param collision
     */

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

    // The owner of the projectile. Can't hit its owner
    this.owner = null;
    this.type = 'Projectile';
    // Origin of the projectile
    this.startx = x;
    this.starty = y;
    // The distance this projectile can travel at most
    this.distance = 100;
    this.damage = 5;
    this.direction = direction;
}

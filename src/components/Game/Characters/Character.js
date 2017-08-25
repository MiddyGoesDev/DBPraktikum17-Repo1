import GameObject from '../GameObject';
import Fist from '../Projectiles/Fist';

export default function Character(x, y) {

    GameObject.call(this, x, y);

    /**
     * Play the idle animation
     */
    this.idle = () => {
        if (!this.isIdling()) {
            this.play('idle');
        }
    };

    /**
     * Play the punch animation
     * Spawn a Fist in current direction
     */
    this.punch = () => {
        if (!this.isPunching()) {
            this.play('punch');
            let fist = new Fist(this.x + this.direction.x * 5, this.y + this.direction.y * 5, this.direction);
            fist.owner = this.id;
        }
    };

    /**
     * Uses the current weapon, play the punch animation.
     */
    this.use = () => {
        if (!this.isUsing() && this.weapon !== null) {
            this.play('punch');
            let projectile = this.weapon.use(this.x + this.direction.x * 5, this.y + this.direction.y * 5, this.direction);
            projectile.owner = this.id;
        }
    };

    /**
     * Play the walking animation.
     */
    this.walk = () => {
        this.play('walk');
    };

    /**
     * Check if player is doing something.
     * @returns {boolean}
     */
    this.isBusy = () => {
        return this.isPunching() || this.isUsing();
    };

    /**
     * Check if player is idling.
     * @returns {boolean}
     */
    this.isIdling = () => {
        return this.animation === 'idle';
    };

    /**
     * Check if player is punching
     * @returns {boolean}
     */
    this.isPunching = () => {
        return this.animation === 'punch';
    };

    /**
     * Check if player is using something
     * TODO parameter, switch
     * @returns {boolean}
     */
    this.isUsing = () => {
        return this.animation === 'punch';
    };

    /**
     * Check if player is walking
     * @returns {boolean}
     */
    this.isWalking = () => {
        return this.animation === 'walk';
    };

    /**
     * Handle collision with Gate, Walls and items.
     * Overwrite parent method, calls when player is colliding with object
     * @param object player is colliding with
     * @param collision the detected collision object
     */
    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Gate':
                // opens the gate and uses all keys in your bag
                let keys = this.items.filter(item => item.name === 'Key');
                if (keys.length !== 0) {
                    this.items = this.items.filter(item => item.name !== 'Key');
                    object.emit('open gate');
                    object.destruct();
                    keys.forEach(key => this.removeFromInventoryBaqend(key));
                }
            case 'CollisionMap':
            case 'Wall':
                // stops the movement when player tries to walk through
                let previousX = this.x - this.direction.x * (this.speed + 1);
                let previousY = this.y - this.direction.y * (this.speed + 1);
                let currentX = this.x;
                let currentY = this.y;
                let nextX = currentX;
                let nextY = currentY;

                this.move();
                let nextCollision = this.checkCollision(object);
                let nextSignX = this.direction.x;
                let nextSignY = this.direction.y;

                // kollidiert nicht nur einen Frame lang
                if (nextCollision !== false) {
                    // kollidiert mehr vertikal
                    if (collision.height >= collision.width) {
                        if (this.direction.x === 0) {
                            // collisionLeft of sprite center
                            if (this.x + 8 > nextCollision.x) {
                                nextSignX = -1;
                            }
                            // collisionRight of sprite center
                            else {
                                nextSignX = 1;
                            }
                        }

                        nextX = currentX - nextSignX * collision.width;
                    }
                    // kollidiert mehr horizontal
                    if (collision.height <= collision.width) {
                        if (this.direction.y === 0) {
                            // collision below sprite center
                            if (this.y + 8 < nextCollision.y) {
                                nextSignY = 1;
                            }
                            // collision above sprite center
                            else {
                                nextSignY = -1;
                            }
                        }
                        nextY = currentY - nextSignY * collision.height;
                    }
                }
                this.updatePosition(nextX, nextY);

                // failsafe
                if (this.checkCollision(object) !== false) {
                    this.updatePosition(previousX, previousY);
                }
                break;
            case 'head':
            case 'main_hand':
            case 'Item':
                // "check"-call on item, handleCollision just for efficiency,
                // the item object, doesn't have to check collision after every tick.
                object.handleCollision(this, collision);
                break;
        }
    };

    this.type = 'Character';
    this.items = [];
    this.weapon = null;
    this.vitality = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
    this.maxHP = () => this.baseHP + this.vitality;
    this.speed = 3;
    this.spawnX = 1290;
    this.spawnY = 3000;
    this.animation = null;
}

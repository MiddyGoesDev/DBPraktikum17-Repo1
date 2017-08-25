import {DIRECTION_SOUTH, directionName} from './Constants/Directions';
import GameStage from './GameStage';
import HpBar from './HpBar';

/**
 * A template for all objects in the game. Almost everything in this game is a GameObject
 * @param x The x coordinate on the stage
 * @param y The y coordinate on the stage
 */

export default function GameObject(x, y) {

    /**
     * Construct the GameObject from previously provided data and place it on the map.
     */
    this.construct = () => {
        this.data.framerate = 25;
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.currentHP = this.baseHP;
        this.hpBar = new HpBar(this);
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    /**
     * Removes the GameObject and its affiliated components from the map.
     */

    this.destruct = () => {
        GameStage().erase(this.text);
        GameStage().erase(this.hpBar.bar);
        GameStage().remove(this);
    };

    /**
     * Abstract method, is supposed to be called every tick.
     */

    this.update = () => { };

    /**
     * Abstract method, used to handle key events.
     */

    this.handleEvent = () => { };

    /**
     * Sends an action and status of a GameObject to the socket server
     * @param action The action to be sent
     */

    this.emit = (action) => {
        GameStage().socket.emit(action, {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
            animation: this.animation,
            currentHP: this.currentHP
        });
    };

    /**
     * Abstract method. Responds to the collision with another object.
     * @param object The object that was collided with
     * @param collision The collision object, detailing the area of the collision
     */
    this.handleCollision = (object, collision) => { };

    /**
     * Checks all near objects for collision.
     */
    this.check = () => {
        let near = GameStage().near(this);
        for (let i = 0; i < near.length; i++) {
            let collision = this.checkCollision(near[i]);
            if (collision !== false) {
                this.handleCollision(near[i], collision);
            }
        }
    };

    /**
     * Tests, whether there has been a collision with an object
     * @param object The object to check
     * @returns false, when no collision exists. A collision object otherwise.
     */
    this.checkCollision = (object) => {
        // TODO: pixelPerfect collision not working reliably (Chrome)
        return window.ndgmr.checkPixelCollision(this.sprite, object.sprite, 0, true);
    };

    /**
     * Sets and plays a given animation on this object.
     * @param animation The animation
     */

    this.play = (animation) => {
        this.animation = animation;
        this.sprite.gotoAndPlay(this.animation + this.direction.name);
    };

    /**
     * Moves the object at its current speed toward its current direction.
     */
    this.move = () => {
        this.updatePosition(this.x + this.direction.x * this.speed, this.y + this.direction.y * this.speed);
    };

    /**
     * Moves the object and its affiliated components to a new position on the stage.
     * @param x The x coordinate on the stage
     * @param y The y coordinate on the stage
     */
    this.updatePosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
        this.hpBar.updatePosition(this);
        this.updateText(x, y);
    };

    /**
     * Abstract method. Moves the text of an object to a new position
     * @param x The x coordinate on the stage
     * @param y The y coordinate on the stage
     */
    this.updateText = (x, y) => { };

    /**
     * Changes the direction of the object according to the given destination its traveling to.
     * @param destX The new x coordinate
     * @param destY The new y coordinate
     */

    this.updateDirection = (destX, destY) => {
        this.direction.x = (destX - this.x) / Math.max(Math.abs(destX - this.x), 1);
        this.direction.y = (destY - this.y) / Math.max(Math.abs(destY - this.y), 1);
        this.direction.name = directionName(this.direction.x, this.direction.y);
    };

    /**
     * Tests, whether the current direction matches another direction
     * @param direction The old direction to compare to
     * @returns {boolean}
     */

    this.directionChanged = (direction) => {
        return this.direction.name !== direction.name;
    };

    /**
     * Constructs frame for a Spritesheet to use with Easel.js
     * @param x The amount of sprites in each line
     * @param y The amount of sprites in each row
     * @returns {Array}
     */

    this.spriteSheet = (x, y) => {
        let frames = [];
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push([this.width * i, this.height * j, this.width, this.height]);
            }
        }
        return frames;
    };

    /**
     * Heals the GameObject for a a given amount. Can't heal more than to maxHP
     * @param hitPoints the amount of hitpoints to heal
     */
    this.heal = (hitPoints) => {
        this.currentHP = Math.min(this.currentHP + hitPoints, this.maxHP());
    };

    /**
     * Deals damage to the GameObject, taking armor under account. Can only reduce HP to 0
     * @param object The object that inflicted damage. Needs a damage property
     */

    this.takeDamage = (object) => {
        this.currentHP = Math.max(0, this.currentHP - Math.max(0, object.damage - this.armor));
        this.hpBar.updateHealth();
        if (this.isDead()) {
            this.destruct();
        }
    };

    /**
     * Returns true, if the character has 0 or less HP.
     */

    this.isDead = () => this.currentHP <= 0;

    /**
     * Respawns the GameObject at its original spawn location after a given delay
     * @param timeout The delay in milliseconds.
     */

    this.respawn = (timeout) => {
        setTimeout(() => {
            this.heal(this.maxHP());
            this.updatePosition(this.spawnX, this.spawnY);
            GameStage().add(this);
            this.hpBar.updateHealth();
        }, timeout);
    };

    // The type of the object
    this.type = 'GameObject';
    // 'relatively' unique ID, used for Socket but not for the DB
    this.id = Math.floor(new Date().valueOf() * Math.random());
    // Position on the map
    this.x = x;
    this.y = y;
    // Original spawn location
    this.spawnX = x;
    this.spawnY = y;
    // Size of the sprite
    this.height = 0;
    this.width = 0;
    // Required sprite information
    this.data = null;
    this.sprite = null;
    // The animation currently playing
    this.animation = null;
    // The direction, made mutable by assign
    this.direction = Object.assign({}, DIRECTION_SOUTH);
    // The speed at which this object travels
    this.speed = 0;
    this.armor = 0;
    this.baseHP = 100;
    this.currentHP = 100;
    this.maxHP = () => this.baseHP;
    // The hpBar to display
    this.hpBar = null;
    // Stores, whether the user input has changed. Only needed when the object is the active object.
    this.keyChanged = false;
}

import GameObject from '../GameObject';
import HpBar from "../HpBar";
import GameStage from "../GameStage";

/**
 * Objects that can be dropped by animals and picked up by players.
 */

export default function Item() {

    /**
     * Spawns the item at position 0,0. Is moved when dropped.
     */
    GameObject.call(this, 0, 0);

    /**
     * Construct the Item from previously provided data.
     */
    this.construct = () => {
        this.data.framerate = 25;
        this.sprite = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);
        this.currentHP = this.baseHP;
        this.hpBar = new HpBar(this);
    };

    /**
     * Does not change when update is called on tick.
     */
    this.update = () => { };

    /**
     * Drops the item at the specified location.
     * @param x The x coordinate on the stage
     * @param y The y coordinate on the stage
     */

    this.drop = (x, y) => {
        this.x = x;
        this.y = y;
        this.updatePosition(this.x, this.y);
        GameStage().add(this);
    };

    /**
     * Handles collision between Characters and Items.
     * Lets players pick up items and equip them. Lets animals destroy them.
     * @param object The object that collided with the item
     * @param collision The information about the collision.
     */

    this.handleCollision = (object, collision) => {
        switch (object.type) {
            case 'Player':
                if (this.type === 'main_hand') {
                    object.weapon = this;
                }
                object.createBaqendItem(this);
                this.destruct();
            case 'Character':
                object.items.push(this);
                this.destruct();
            case 'Cow':
                this.destruct();
                break;
        }
    };

    // The type of the object
    this.type = 'Item';
    // The stats of the item. Added to the character wearing the item, displayed in the profile
    this.vitality = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
    this.movementSpeed = 0;
}

import Item from './Item';

/**
 * Spawns gold at the specified location.
 * @param x The x coordinate on the stage
 * @param y The y coordinate on the stage
 */

export default function Gold(x, y) {

    Item.call(this, x, y);

    // sprite size
    this.height = 16;
    this.width = 16;
    // sprite info from a picture file
    this.data = {
        images: ['./assets/items/Gold.png'],
        frames: this.spriteSheet(1, 1),
        animations: {
            idleSouth: [0, 0, 'idleSouth', 0]
        }
    };

    this.hp = 1;
    this.armor = 10;
    // The name to display
    this.name = 'Gold';
    // Create the object
    this.construct();
    // Play the idle animation
    this.play('idle');

}

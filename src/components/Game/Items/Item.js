import GameObject from '../GameObject';

export default function Item(x, y) {

    GameObject.call(this, x, y);

    this.update = () => { };

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

    this.type = 'Item';
    this.vitality = 0;
    this.strength = 0;
    this.dexterity = 0;
    this.intelligence = 0;
    this.movementSpeed = 0;
    this.startx = x;
    this.starty = y;
}

import GameObject from './GameObject';


export default function Cow(x, y) {

    GameObject.call(this, x, y);

    this.data = {
        images: ['./assets/cow.png'],
        frames: this.spriteSheet(4, 4, 16),
        animations: {
            walkEast: [12, 15, 'walkEast', 0.3],
            walkWest: [4, 7, 'walkWest', 0.3],
            walkNorth: [0, 3, 'walkNorth', 0.3],
            walkSouth: [8, 11, 'walkSouth', 0.3]
        }
    };

    this.type = 'Cow';
    this.speed = 4;

    this.construct();

}
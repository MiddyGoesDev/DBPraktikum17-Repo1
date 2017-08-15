import Character from './Character';

export default function OpponentGuy(x, y) {

    Character.call(this, x, y);

    this.update = () => {
        switch (this.animation) {
            case 'idle': this.idle(); break;
            case 'walk': this.walk(); break;
            case 'punch': this.punch(); break;
        }
    };

    let frames = [];

    for (let j = 0; j < 18; j++) {
        for (let i = 0; i < 12; i++) {
            frames.push([16 + 16 * i, 16 + 16 * j, 16, 16]);
        }
    }

    this.data = {
        images: ['./assets/sprites.png'],
        frames: frames,
        animations: {
            walk: [8 * 12, 8 * 12 + 2, 'walk', 0.3],
            idle: [6 * 12, 6 * 12 + 3, 'idle', 0.25],
            punch: [15 * 12, 15 * 12 + 2, 'idle', 0.5],
            runningKick: [15 * 12 + 7, 15 * 12 + 10, 'idle', 0.25]
        }
    };

    this.construct();
    this.idle();
}

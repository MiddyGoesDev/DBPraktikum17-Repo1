
export default function HpBar() {



    this.spriteSheet = (x, y, size) => {
        let frames = [];
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push([size * i, size * j, size, size]);
            }
        }
        return frames;
    };

    this.data = {
        images: ['./assets/hpBar.png'],
        frames: this.spriteSheet(10, 10, 16),
        animations: {
            '100': [0, 0, '100', 1]

        }
    };

    this.animation =
        this.hpBar = new window.createjs.Sprite(new window.createjs.SpriteSheet(this.data), this.animation);

}

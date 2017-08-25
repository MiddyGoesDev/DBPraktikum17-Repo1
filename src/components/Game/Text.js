export default function Text(string, x, y, size, font, color) {

    let text = new window.createjs.Text(string + '', size + "px " + font, color);
    text.x = x;
    text.y = y;

    return text;
};




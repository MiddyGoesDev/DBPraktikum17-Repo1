/**
 * Creates a Create.js Text to a given string
 * @param string The text to display
 * @param x The x position on the map
 * @param y the y position on the map
 * @param size The size in pixel
 * @param font The font to use
 * @param color The color of the text
 * @returns the create.js.Text() object
 */
export default function Text(string, x, y, size, font, color) {

    let text = new window.createjs.Text(string + '', size + "px " + font, color);
    text.x = x;
    text.y = y;

    return text;
};
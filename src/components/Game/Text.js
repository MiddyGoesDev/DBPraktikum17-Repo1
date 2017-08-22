export default function Text(string) {

    // Embedded SpriteSheet data.
    var data = {
        "images": ["./assets/pixelfont.png"],
        "frames": {width:28, height:36, regX: 0, regY:0, spacing:0, margin:0},
        "animations": {
            "A": {"frames": [0]},
            "B": {"frames": [1]},
            "C": {"frames": [2]},
            "D": {"frames": [3]},
            "E": {"frames": [4]},
            "F": {"frames": [5]},
            "G": {"frames": [6]},
            "H": {"frames": [7]},
            "I": {"frames": [8]},
            "J": {"frames": [9]},
            "K": {"frames": [10]},
            "L": {"frames": [11]},
            "M": {"frames": [12]},
            "N": {"frames": [13]},
            "O": {"frames": [14]},
            "P": {"frames": [15]},
            "Q": {"frames": [16]},
            "R": {"frames": [17]},
            "S": {"frames": [18]},
            "T": {"frames": [19]},
            "U": {"frames": [20]},
            "V": {"frames": [21]},
            "W": {"frames": [22]},
            "X": {"frames": [23]},
            "Y": {"frames": [24]},
            "Z": {"frames": [25]},
            "a": {"frames": [26]},
            "b": {"frames": [27]},
            "c": {"frames": [28]},
            "d": {"frames": [29]},
            "e": {"frames": [30]},
            "f": {"frames": [31]},
            "g": {"frames": [32]},
            "h": {"frames": [33]},
            "i": {"frames": [34]},
            "j": {"frames": [35]},
            "k": {"frames": [36]},
            "l": {"frames": [37]},
            "m": {"frames": [38]},
            "n": {"frames": [39]},
            "o": {"frames": [40]},
            "p": {"frames": [41]},
            "q": {"frames": [42]},
            "r": {"frames": [43]},
            "s": {"frames": [44]},
            "t": {"frames": [45]},
            "u": {"frames": [46]},
            "v": {"frames": [47]},
            "w": {"frames": [48]},
            "x": {"frames": [49]},
            "y": {"frames": [50]},
            "z": {"frames": [51]},
            "0": {"frames": [52]},
            "1": {"frames": [53]},
            "2": {"frames": [54]},
            "3": {"frames": [55]},
            "4": {"frames": [56]},
            "5": {"frames": [57]},
            "6": {"frames": [58]},
            "7": {"frames": [59]},
            "8": {"frames": [60]},
            "9": {"frames": [61]},
            ".": {"frames": [62]},
            ",": {"frames": [63]},
            "!": {"frames": [64]},
            "?": {"frames": [65]},
            "'": {"frames": [66]},
            "@": {"frames": [67]},
            "#": {"frames": [68]},
            "$": {"frames": [69]},
            "%": {"frames": [70]},
            "&": {"frames": [71]},
            "(": {"frames": [72]},
            ")": {"frames": [73]},
            "/": {"frames": [74]},
            "-": {"frames": [75]},
            "+": {"frames": [76]},
            "=": {"frames": [77]},
        }
    };


    var ss = new window.createjs.SpriteSheet(data);
    var text = new window.createjs.BitmapText(string , ss);
    text.scaleX = 0.5;
    text.scaleY = 0.4;
    text.letterSpacing = -12;
    text.lineHeight = 1;

    return text;
};





export function connect(playing) {
    return {
        'BAQEND': {
            type: "CONNECT",
            payload: (db) => {
                db.User.me.playing = playing;
                return db.User.me.update();
            }
        }
    }
}
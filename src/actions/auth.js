import {USER_LOGIN, USER_REGISTER, USER_LOGOUT} from './types'

export function login(username, password) {
    return {
        'BAQEND': {
            type: USER_LOGIN,
            payload: (db) => {
                return db.User.login(username, password).then((user) => {
                    console.log('funktioniert mit react');
                    user.playing = false;
                    user.update();
                    return user;
                });
            }
        }
    }
}

export function register(username, password) {
    return {
        'BAQEND': {
            type: USER_REGISTER,
            payload: (db) => db.User.register(username, password)
        }
    };
}

export function logout() {
    return {
        'BAQEND': {
            type: USER_LOGOUT,
            payload: (db) => db.User.logout()
        }
    }
}

/*
 new db.Opponent({
 id: db.User.me.id,
 x: this.x,
 y: this.y,
 animation: this.sprite.currentAnimation,
 direction: this.direction,
 playing: false
 }).insert();
 */
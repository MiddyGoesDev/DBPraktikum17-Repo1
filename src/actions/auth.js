import {USER_LOGIN, USER_REGISTER, USER_LOGOUT, CREATE_CHARACTER, INITIALIZE_PLAYING, ME, CREATE_STATS} from './types'

export function login(username, password) {
    return {
        'BAQEND': {
            type: USER_LOGIN,
            payload: (db) => db.User.login(username, password)
        }
    }
}

export function register(username, password) {
    return {
        'BAQEND': {
            type: USER_REGISTER,
            payload: (db) =>  db.User.register(username, password)
        }
    };
}

export function createCharacter(user) {
    return {
        'BAQEND': {
            type: CREATE_CHARACTER,
            payload: (db) => {
                let character = new db.Character({
                    'owner': user,
                    'x': 10,
                    'y': 10,
                    'animation': 'idle',
                    'direction': 180
                });
                return character.insert();
            }
        }
    };
}

export function createStats(user) {
    return {
        'BAQEND': {
            type: CREATE_STATS,
            payload: (db) => {
                let stats = new db.Statistic({
                    'nameID': user,
                    'kills': 0,
                    'deaths': 0,
                    'xp': 0,
                    'playingTime': 0
                });
                return stats.insert();
            }
        }
    };
}

export function initializePlaying(user, character) {
    return {
        'BAQEND': {
            type: INITIALIZE_PLAYING,
            payload: (db) => {
                let playing = new db.Playing({ 'online': false, 'user': user, 'character': character});
                return playing.insert();
            }
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

export function me() {
    return {
        'BAQEND': {
            type: ME,
            payload: (db) => db.User.find(db.User.me.username).singleResult()
        }
    }
}

import {USER_LOGIN, USER_REGISTER, USER_LOGOUT, CREATE_CHARACTER, CREATE_STATISTICS, ME} from './types'

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
                    'direction': 180,
                    'xp': 0,
                    'level': 0,
                    'playing': false
                });
                return character.insert();
            }
        }
    };
}

export function createStatistics(character) {
    return {
        'BAQEND': {
            type: CREATE_STATISTICS,
            payload: (db) => {
<<<<<<< HEAD
              db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
                var stats = new db.Statistic({
                    'character': result,
=======
                let stats = new db.Statistic({
                    'character': character,
>>>>>>> b7bc388c7d466653dba178358df6b7bb3b20028c
                    'kills': 0,
                    'deaths': 0,
                    'playingTime': 0
                });
                return stats.insert();
              })

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

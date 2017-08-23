import {USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, USER_LOGOUT, CREATE_CHARACTER, CREATE_EQUIPMENT, CREATE_STATISTICS, ME, USER_REGISTER} from './types';
import {DIRECTION_SOUTH} from '../components/Game/Constants/Directions';

export function login(username, password) {
    return {
        'BAQEND': {
            types: [
                USER_LOGIN,
                USER_LOGIN_SUCCESS,
                USER_LOGIN_FAILURE
            ],
            payload: (db) => db.User.login(username, password).then(result => result)
        }
    }
}

export function register(username, password) {
    return {
        'BAQEND': {
            type:
              USER_REGISTER,
            payload: (db) => db.User.register(username, password).then(result => result)
        }
    }
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
                    'direction': DIRECTION_SOUTH,
                    'base_hp': 100,
                    'current_hp': 100,
                    'vitality': Math.floor(Math.random() * 5),
                    'strength': Math.ceil(Math.random() * 5),
                    'dexterity': Math.floor(Math.random() * 5),
                    'intelligence': Math.floor(Math.random() * 5),
                    'xp': 0,
                    'level': 1,
                    'playing': false
                });
                return character.insert();
            }
        }
    };
}

export function createEquipment(character) {
    return {
        'BAQEND': {
            type: CREATE_EQUIPMENT,
            payload: (db) => {
                let equipment = new db.Equipment({
                    'body': character,
                });
                return equipment.insert();
            }
        }
    };
}

export function createStatistics(character, user) {
    return {
        'BAQEND': {
            type: CREATE_STATISTICS,
            payload: (db) => {
                let stats = new db.Statistic({
                    'character': character,
                    'kills': 0,
                    'playingTime': 0,
                    'username': user,
                });
                return stats.insert();
            }
        }
    }
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
            payload: (db) => db.User.find(db.User.me.id).singleResult()
        }
    }
}

export function checkForExsistence(input) {
  return {
    'BAQEND': {
      type: "CHECK_FOR_EXSISTENCE",
      payload: (db) => db.User.find().equal('username', input).singleResult().then(user => {
              return user !== null;
      })
        // TODO baqend code oder lieber refactoren
        /*
       payload: (db) => db.modules.get("checkForExsistence" ,{userInput: input}).then((result) => {
         return result.exists;
        })
        */
        }
      }
    }

import {USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, USER_LOGOUT, CREATE_CHARACTER, CREATE_EQUIPMENT, CREATE_STATISTICS, ME, USER_REGISTER_SUCESS, USER_REGISTER_FAILURE, USER_REGISTER} from './types';
import {DIRECTION_SOUTH} from '../components/Game/Constants/Directions';

/*
* Baqend login function, if combination of password and user is correct, login is sucessfull.
* @param username: the username to be logged in
* @param password: the password belonging to the username
* @return one of the types, gets dealed with in the reducer
*/
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

/*
* Baqend register function, inserts a new combination of username and password into the db.
* User is loged in after sucessfull registration.
* @param username: the username to be registered
* @param password: the password to be registered with the username
* @return one of the types, gets dealed with in the reducer
*/
export function register(username, password) {
    return {
        'BAQEND': {
            types: [
                USER_REGISTER,
                USER_REGISTER_SUCESS,
                USER_REGISTER_FAILURE
            ],
            payload: (db) => db.User.register(username, password).then(result => result)
        }
    }
}

/*
* Creates a playable character for the user and initializes the fields accordingly
* @param user: the user for which the character gets created
*/
export function createCharacter(user) {
    return {
        'BAQEND': {
            type: CREATE_CHARACTER,
            payload: (db) => {
                let character = new db.Character({
                    'owner': user,
                    'x': 1240 + Math.floor(Math.random() * 100),
                    'y': 3000 + Math.floor(Math.random() * 50),
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

/*
* Creates the equipment for the character which can be inspected in the profile
* @param character: the character which gets the Equipment
*/
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

/*
* Creates the statistics for a user and the users character, initializes the fields
* @param character: the character to which the statistics belong
* @param user: the user to which the statistics belong
* TODO refactor wenn zeit username rausnehmen, müsste ja ohne auch gehen
*/
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

/*
* Baqends logout function. Logs the user out that is loged in
*/
export function logout() {
    return {
        'BAQEND': {
            type: USER_LOGOUT,
            payload: (db) => db.User.logout()
        }
    }
}

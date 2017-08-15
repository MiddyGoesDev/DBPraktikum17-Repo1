import { JOIN, LEAVE, FIND_OPPONENTS, GET_CHARACTER, OWN_CHARACTER } from './types'

export function join() {
    return {
        'BAQEND': {
            type: JOIN,
            payload: (db) => {
                db.User.me.playing = true;
                return db.User.me.update();
            }
        }
    }
}

export function leave() {
    return {
        'BAQEND': {
            type: LEAVE,
            payload: (db) => {
                db.User.me.playing = false;
                return db.User.me.update();
            }
        }
    }
}

export function findOpponents() {
    return {
        'BAQEND': {
            type: FIND_OPPONENTS,
            payload: (db) => {
                let users = db.User.find().eq('playing', true);
                users.resultStream(result => console.log(result.map((user) => user.id)));

                // var opponents = db.Character.find().in('id', '/db/Character/515870344283', '/db/Character/307518331416');
                //opponents.resultStream(result => console.log(result));
                return users;
            }
        }
    }
}

export function getCharacter(user) {
    return {
        'BAQEND': {
            type: GET_CHARACTER,
            payload: (db) => db.Character.find().equal('owner', user).resultList()
        }
    }
}

export function ownCharacter() {
    return {
        'BAQEND': {
            type: OWN_CHARACTER,
            payload: (db) => {
                getCharacter(db.User.me);
            }
        }
    }
}
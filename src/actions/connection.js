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


                // db.Character.find().notEqual('owner', db.User.me).eq;

                let users = db.User.find().eq('playing', true).notEqual('id', db.User.me.id);
                return users.resultList(user => {
                    return db.Character.find().in('owner', user);
                });
            }
        }
    }
}

export function ownCharacter() {
    return {
        'BAQEND': {
            type: OWN_CHARACTER,
            payload: (db) => db.Character.find().equal('owner', db.User.me).singleResult()
        }
    }
}
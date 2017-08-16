import {JOIN, LEAVE, OWN_CHARACTER, FIND_OPPONENTS, UPDATE_OPPONENTS} from './types'
import GameStage from '../components/Game/GameStage';
import Opponent from '../components/Game/OpponentGuy';

export function join() {
    return {
        'BAQEND': {
            type: JOIN,
            payload: (db) => db.Playing.find().equal('user', db.User.me).singleResult(character => {
                character.online = true;
                return character.update();
            })
        }
    }
}

export function leave() {
    return {
        'BAQEND': {
            type: LEAVE,
            payload: (db) => db.Playing.find().equal('user', db.User.me).singleResult(character => {
                character.online = false;
                return character.update();
            })
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

export function linkOpponents() {
    return {
        'BAQEND': {
            type: FIND_OPPONENTS,
            payload: (db) => {
                return db.Playing.find().notEqual('user', db.User.me).equal('online', true).resultStream()
                    .subscribe(playing => playing.forEach(player => db.Character.load(player.character.id)
                        .then(character => {
                            if (player.online && GameStage().networkObjects.indexOf(character.id) === -1) {
                                let opponent = new Opponent(character.x, character.y);
                                opponent.id = character.id;
                                GameStage().link(opponent);
                            } else if (!player.online) {
                                GameStage().unlink(character.id);
                            }
                        })))
            }
        }
    }
}

export function updateOpponents() {
    return {
        'BAQEND': {
            type: UPDATE_OPPONENTS,
            payload: (db) => {
                return db.Character.find().eventStream().subscribe(character => {
                    if (GameStage().networkObjects[character.data.id] !== undefined) {
                        GameStage().networkObjects[character.data.id].updatePosition(character.data.x, character.data.y);
                    }
                });
            }
        }
    }
}
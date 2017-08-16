import {JOIN, LEAVE, OWN_CHARACTER, UPDATE_OPPONENTS, UPDATE_CHARACTER} from './types'
import GameStage from '../components/Game/GameStage';
import Opponent from '../components/Game/OpponentGuy';

export function join() {
    return {
        'BAQEND': {
            type: JOIN,
            payload: (db) => db.Character.find().equal('owner', db.User.me).singleResult(character => {
                character.playing = true;
                return character.update();
            })
        }
    }
}

export function leave() {
    return {
        'BAQEND': {
            type: LEAVE,
            payload: (db) => db.Character.find().equal('owner', db.User.me).singleResult(character => {
                character.playing = false;
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

export function updateOpponents() {
    return {
        'BAQEND': {
            type: UPDATE_OPPONENTS,
            payload: (db) => {
                return db.Character.find().eventStream().subscribe(character => {
                    if (character.data.playing && !GameStage().networkObjects.hasOwnProperty(character.data.id)) {
                        let opponent = new Opponent(character.data.x, character.data.y);
                        opponent.id = character.data.id;
                        GameStage().link(opponent);
                    } else if (!character.data.playing && GameStage().networkObjects.hasOwnProperty(character.data.id)) {
                        GameStage().unlink(character.data.id);
                    }
                    if (character.data.playing && (character.data.id!==GameStage().activeObject.id)) {
                        console.log('haaaate');
                        GameStage().networkObjects[character.data.id].updatePosition(character.data.x, character.data.y)
                    }
                });
            }
        }
    }
}

export function updateCharacter(data) {
    return {
        'BAQEND': {
            type: UPDATE_CHARACTER,
            payload: (db) => db.Character.load(data.id).singleResult(character => {
                console.log('update character');
                character.x = data.x;
                character.y = data.y;
                character.direction = data.direction;
                character.animation = data.animation;
                return character.update();
            })
        }
    }
}
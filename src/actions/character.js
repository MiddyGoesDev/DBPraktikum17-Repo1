import {JOIN, LEAVE, OWN_CHARACTER, UPDATE_OPPONENTS, UPDATE_CHARACTER, SET_TIMER} from './types'
import GameStage from '../components/Game/GameStage';
import Opponent from '../components/Game/Characters/OpponentGuy';
import Manji from "../components/Game/Items/Manji";
import YagyuRyuYayuji from "../components/Game/Items/YagyuRyuYayuji";
import KoboriRyuHorenGata from "../components/Game/Items/KoboriRyuHorenGata";
import IgaRyuHappo from "../components/Game/Items/IgaRyuHappo";
import GurandoMasutaa from "../components/Game/Items/GurandoMasutaa";

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

// TODO refactor
export function updateOpponents() {
    return {
        'BAQEND': {
            type: UPDATE_OPPONENTS,
            payload: (db) => {
                return db.Character.find().eventStream().subscribe(character => {
                    if (character.data.playing && !GameStage().networkObjects.hasOwnProperty(character.data.id)) {
                        let opponent = new Opponent(character.data.x, character.data.y);
                        opponent.id = character.data.id;
                        opponent.direction = character.data.direction;
                        opponent.baseHP = character.data.base_hp;
                        opponent.currentHP = character.data.current_hp;
                        opponent.animation = 'idle';
                        db.User.load(character.data.owner.id).then(user => opponent.rename(user.username));
                        GameStage().link(opponent);

                        db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result).then(equipment => {
                            if (equipment.main_hand !== null) {
                                switch (equipment.main_hand.name) {
                                    case 'Manji': opponent.weapon = new Manji(0, 0); break;
                                    case 'Yagyu Ryu Yayuji': opponent.weapon = new YagyuRyuYayuji(0, 0); break;
                                    case 'Kobori Ryu Horen Gata': opponent.weapon = new KoboriRyuHorenGata(0, 0); break;
                                    case 'Iga Ryu Happo': opponent.weapon = new IgaRyuHappo(0, 0); break;
                                    case 'Gurando Masutaa': opponent.weapon = new GurandoMasutaa(0, 0); break;
                                }
                            }
                        });
                    } else if (!character.data.playing && GameStage().networkObjects.hasOwnProperty(character.data.id)) {
                        GameStage().unlink(character.data.id);
                    }
                    if (character.data.playing && (character.data.id!==GameStage().activeObject.id)) {
                        GameStage().networkObjects[character.data.id].updatePosition(character.data.x, character.data.y);
                        GameStage().networkObjects[character.data.id].nextDirection = character.data.direction;
                        GameStage().networkObjects[character.data.id].nextAnimation = character.data.animation;
                        GameStage().networkObjects[character.data.id].currentHP = character.data.current_hp;
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
                character.x = data.x;
                character.y = data.y;
                character.direction = data.direction;
                character.animation = data.animation;
                return character.update();
            })
        }
    }
}

export function setTimer(joinTime) {
  return {
    'BAQEND': {
      type: SET_TIMER,
      payload: (db) => {
          return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
            return db.Statistic.find().equal('character', result).singleResult().then((stats) => {
              stats.playingTime += Math.abs(new Date() - joinTime);
              return stats.update();
            })
          })
        }
      }
    }
  }

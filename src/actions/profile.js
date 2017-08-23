import {EQUIPMENT, MY_STATISTICS, MY_CHARACTER, GET_CHARACTER, GET_EQUIPMENT, LOAD_CHARACTER} from "./types";

export function myStatistics() {
    return {
        'BAQEND': {
            type: MY_STATISTICS,
            payload: (db) => {
                return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
                    return db.Statistic.find().equal('character', result).singleResult().then((stats) => {
                        return stats
                    })
                })

            }
        }
    }
}

export function equipment() {
    return {
        'BAQEND': {
            type: EQUIPMENT,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult(character =>
                db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result))
        }
    }
}

export function getEquipment(character) {
    return {
        'BAQEND': {
            type: GET_EQUIPMENT,
            payload: (db) => db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result)
        }
    }
}

export function myCharacter() {
    return {
        'BAQEND': {
            type: MY_CHARACTER,
            payload: (db) => {
                return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
                    return result
                })

            }
        }
    }
}

export function getCharacter(user) {
    return {
        'BAQEND': {
            type: GET_CHARACTER,
            payload: (db) => {
                return db.Character.find().equal('owner', user).singleResult()
            }
        }
    }
}

export function loadCharacter(character) {
    return {
        'BAQEND': {
            type: LOAD_CHARACTER,
            payload: (db) => {
                return db.Character.load(character.id)
            }
        }
    }
}

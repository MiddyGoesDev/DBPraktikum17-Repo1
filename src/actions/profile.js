import {
    EQUIPMENT,
    INVENTORY,
    MY_STATISTICS,
    MY_CHARACTER,
    GET_CHARACTER,
    GET_EQUIPMENT,
    GET_INVENTORY,
    LOAD_CHARACTER
} from "./types";

/**
 * Finds the statistics for the user that is loged in via the character that user ownes.
 */
export function myStatistics() {
    return {
        'BAQEND': {
            type: MY_STATISTICS,
            payload: (db) => {
                return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => { //returns the right character for the logged in User
                    return db.Statistic.find().equal('character', result).singleResult().then((stats) => { //returns the right statistic for the just found character
                        return stats
                    })
                })
            }
        }
    }
}

/**
 * Finds the equipment for the user that is loged in via the character that user ownes.
 */
export function equipment() {
    return {
        'BAQEND': {
            type: EQUIPMENT,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult(character => //returns the character object for the logged in User
                db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result)) //finds the equipment for the just found character
        }
    }
}

/**
 * Finds the inventory for the user that is loged in via the character that user ownes.
 */
export function inventory() {
    return {
        'BAQEND': {
            type: INVENTORY,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult(character =>
                db.InventoryItem.find().equal('owner', character.id).equal('active', true).resultList({depth: 1}, result => result))
        }
    }
}

/**
 * Finds the equipment for any character given as parameter.
 * @param character: the charater for which the equipment is wanted
 */
export function getEquipment(character) {
    return {
        'BAQEND': {
            type: GET_EQUIPMENT,
            payload: (db) => db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result)
        }
    }
}

/**
 * Finds the inventory for any character given as paraeter.
 * @param character: the charater for which the invntory is wanted
 */
export function getInventory(character) {
    return {
        'BAQEND': {
            type: GET_INVENTORY,
            payload: (db) => db.InventoryItem.find().equal('owner', character).equal('active', true).resultList({depth: 1}, result => result)
        }
    }
}

/**
 * Finds the Character of the user that is logged in.
 */
export function myCharacter() {
    return {
        'BAQEND': {
            type: MY_CHARACTER,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult().then(result => result)
        }
    }
}

/**
 * Finds the character for any user given as parameter.
 * @param user: user for which the character is wanted
 */
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

/**
 * Loads the character based on its id, this is needed for the ranking where we only have the characters id,
 * but not the character entire charater information.
 * @param charcter: the character of which we have the id and want the entire character
 */
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

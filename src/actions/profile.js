import {EQUIPMENT, INVENTORY, MY_STATISTICS, MY_CHARACTER, GET_CHARACTER, GET_EQUIPMENT, GET_INVENTORY, LOAD_CHARACTER} from "./types";

/*
* Finds the statistics for the user that is loged in via the character that user ownes.
* @return the statistics for the user, ie time spend playing the game
*/
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

/*
* Finds the equipment for the user that is loged in via the character that user ownes.
* @return the equipment for the user, ie the weapon
*/
export function equipment() {
    return {
        'BAQEND': {
            type: EQUIPMENT,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult(character =>
                db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result))
        }
    }
}

/*
* Finds the inventory for the user that is loged in via the character that user ownes.
* @return the inventory for the user
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

/*
* Finds the equioment for any character.
* @param character: the charater for which the equipment is wanted
* @return the equipment for the character
*/
export function getEquipment(character) {
    return {
        'BAQEND': {
            type: GET_EQUIPMENT,
            payload: (db) => db.Equipment.find().equal('body', character).singleResult({depth: 1}, result => result)
        }
    }
}

/*
* Finds the inventory for any character.
* @param character: the charater for which the invntory is wanted
* @return the inventory for the character
*/
export function getInventory(character) {
    return {
        'BAQEND': {
            type: GET_INVENTORY,
            payload: (db) => db.InventoryItem.find().equal('owner', character).equal('active', true).resultList({depth: 1}, result => result)
        }
    }
}

/*
* Finds the Character of the user that is logged in.
* @return the character for the user that is logged in
*/
export function myCharacter() {
    return {
        'BAQEND': {
            type: MY_CHARACTER,
            payload: (db) => db.Character.find().equal('owner', db.User.me.id).singleResult().then(result => result)
        }
    }
}

/*
* Finds the character for any user.
* @param user: user for which the character is wanted
* @return the character belonging to the user
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

/*
* Loads the character based on its id, this is needed for the ranking where we only have the characters id,
* but not the character.
* @param charcter: the character of which we haev the id and want the entire character
* @return the character based on its id
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

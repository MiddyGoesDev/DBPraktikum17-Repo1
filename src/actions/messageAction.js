//import { MESSAGE } from './types'

export function sendMessage(text) {

  return {
    'BAQEND': {
      type: "MESSAGE_SEND",
      payload: (db) => {
        var messageObj = new db.Message({
          'name':db.User.me.username,
          'message':text,
          'date':new Date()
        });
        return messageObj.insert()
      }
    }
  }
}

export function getMessages() {
    return {
        'BAQEND': {
            type: "MESSAGES_NEXT",
            payload: (db) => {
              return db.Message.find().ascending("date").resultStream() //resultStream macht das immer wenn sich die List in DB ändert wir sie Übergeben bekommen
            }
            //payload: async (db) => {
            //  let messages = await db.Message.find().resultList()
            //  return messages
            //  }
        }
    }
}

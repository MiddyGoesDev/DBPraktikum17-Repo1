import { MESSAGE } from './types'

export function sendMessage(text, bool) {

  return {
    'BAQEND': {
      type: "MESSAGE_SEND",
      payload: (db) => {
        var messageObj = new db.Message({
          'name':db.User.me.username,
          'message':text,
          'date':new Date(),
          'isJoinInfo':bool,
        });
        return messageObj.insert()
      }
    }
  }
}

//resultStream macht das immer wenn sich die List in DB ändert wir sie Übergeben bekommen
export function getMessages() {
    return {
        'BAQEND': {
            type: "MESSAGES_NEXT",
            payload: (db) => {
              return db.Message.find().ge("date", new Date().toISOString()).ascending("date").resultStream()
              //return db.Message.find().ascending("date").resultStream()
            }

            //payload: async (db) => {
            //  let messages = await db.Message.find().resultList()
            //  return messages
            //  }
        }
    }
}

import { MESSAGE } from './types'

export function sendMessage(Name, texT) {

  return {
    'BAQEND': {
      type: MESSAGE,
      payload: (db) => {
        var messageObj = new db.Message({
          'name':Name,
          'message':texT,
          'date':new Date()
        });
        return messageObj.insert()
      }
    }
  }
}

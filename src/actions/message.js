import { MESSAGE } from './types'

export function sendMessage(Name, texT) {

  return {
    'BAQEND': {
      type: MESSAGE,
      payload: (db) => {
        var messageObj = new db.Message({
          'name':db.User.me.username,
          'message':texT,
          'date':new Date()
        });
        return messageObj.insert()
      }
    }
  }
}

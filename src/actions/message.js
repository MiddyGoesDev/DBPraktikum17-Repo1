import { MESSAGE } from './types'
// import { db } from 'baqend/lib/baqend';


export function sendMessage(Name, texT) {
  // var messageObj = new db.Message({
  //   'name':Name,
  //   'message':texT,
  //   'date':new Date()
  // });

  return {
    'BAQEND': {
      type: MESSAGE,
      payload: (db) => {
        console.log("send message payload")
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


export function sendMessage(text) {
  return {
    'BAQEND': {
      type: "MESSAGE_SEND",
      payload: (db) => {
        let messageObj = new db.Message({
          'name':db.User.me.username,
          'message':text,
        });
        return messageObj.insert().then((abort) => {
        },
        (error) => {
          console.log(error.message);
        });
      }
    }
  }
}

//resultStream macht das immer wenn sich die List in DB ändert wir sie Übergeben bekommen
//.ge("date", new Date().toISOString())
//return db.Message.find().ascending("date").resultStream()

export function getMessages() {
    return {
        'BAQEND': {
            type: "MESSAGES_NEXT",
            payload: (db) => {
              return db.Message.find().ge("createdAt", new Date().toISOString()).ascending("createdAt").resultStream()
            }
        }
    }
}

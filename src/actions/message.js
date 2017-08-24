import {MESSAGE_SEND, MESSAGES_NEXT} from './types';

/*
* Sends a message which will be seen by everyone in the Chat. The Message gets inserted into the db.
* @param test: the message to be inserted into the db
* @return inserts the message into the db
*/
export function sendMessage(text) {
  return {
    'BAQEND': {
      type: MESSAGE_SEND,
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


/*
* Gets all the messages that are the players has displayed in his chat. resultStream() updates the list with the messages
* everytime it changes, comes from baqend realtime
* @return finds all the messages that have been written after the user switched to the game component
*/
export function getMessages() {
    return {
        'BAQEND': {
            type: MESSAGES_NEXT,
            payload: (db) => {
              return db.Message.find().ge("createdAt", new Date().toISOString()).ascending("createdAt").resultStream()
            }
        }
    }
}

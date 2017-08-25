import {MESSAGE_SEND, MESSAGES_NEXT} from './types';

/**
 * Sends a message (which will be seen by everyone in the Chat). The Message gets inserted into the db.
 * @param text: the message to be displayed and inserted into the db
 */
export function sendMessage(text) {
    return {
        'BAQEND': {
            type: MESSAGE_SEND,
            payload: (db) => {
                let messageObj = new db.Message({
                    'name': db.User.me.username,
                    'message': text,
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


/**
 * Gets all messages from the db that have been written after the subscription of this realtime query
 * Whenever the result of the query changes, it returns the updated version. in that way the new messages
 * appear in the chat
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

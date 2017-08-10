import { MESSAGE } from './types'

export function sendMessage(text) {

  return {
    'BAQEND': {
      type: MESSAGE,
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
            type: MESSAGE,
            payload: (db) => {
              return db.Message.find()
              .ascending("date")
              .resultList()
              .then((results) => {
                var html =""
                results.forEach((message) => {
                  html += '<div class="kp">'+ message.name +": " +  message.message +'</div>'
                });
                document.getElementById("chat-message").innerHTML = html;
                //console.log(results)
                //return results
              })
            }
            //payload: async (db) => {
            //  let messages = await db.Message.find().resultList()
            //  console.log(messages)
            //  return messages
            //  }
        }
    }
}

/**
function showMessages() {
  DB.Message.find()
    .descending("date")
    .limit(30)
    .resultList()
    .then(function(result) {
        var html = "";
        result.forEach(function(msg) {
            html += '<div class="col-md-4"><h2>';
            html += msg.name + '</h2><p>' + msg.message + '</p></div>';
        });
        document.getElementById("messages").innerHTML = html;
    });
    **/

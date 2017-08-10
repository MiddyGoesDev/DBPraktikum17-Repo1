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

export function showMessages() {

    return {
        'BAQEND': {
            type: MESSAGE,
            payload: (db) => {
               var messageList = db.Message.find()
                  .descending("date")
                  .limit(30)
                  .resultList()
                  return messageList;
            }
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
}

**/

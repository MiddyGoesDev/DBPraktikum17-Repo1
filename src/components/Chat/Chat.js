import './Chat.css';
import React from 'react';

class Chat extends React.Component {
    render() {
        return (
            <div className="chat-room">
                <div className="chat-messages" id="chat-messages">

                </div>
                <div className="chat-interface">
                    <form onSubmit="leaveMessage(this.message.value); this.reset(); return false;">
                        <input type="text" name="message" placeholder="Send a message"/>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Chat

/**
<div class="jumbotron">
    <form onsubmit="leaveMessage(this.message.value);
    this.reset(); return false;" class="form-inline text-center container">
    <input class="form-control" name="message" placeholder="Message">
    <button type="submit" class="btn btn-primary">Leave Message</button>
    </form>
    </div>
<div class="container"><div class="row" id="messages"></div>
**/

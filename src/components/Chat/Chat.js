import './Chat.css';
import React from 'react';

class Chat extends React.Component {
    render() {
        return (
            <div className="chat-room">
                <div className="chat-messages">

                </div>
                <div className="chat-interface">
                    <form>
                        <input type="text" placeholder="Send a message"/>
                        <input type="submit" value={"send"}/>
                    </form>
                </div>
            </div>
        );
    }
}

export default Chat

import './Chat.css';
import React from 'react';
import { db } from 'baqend/lib/baqend';
import {getMessages} from '../../actions/messageAction'

class Message extends React.Component {
    render() {

        //var query = getMessages();
        //query.resultStream(result => console.log(result));

        return (
            <div id="chat-message">
            </div>
        );
    }
}

export default Message

import './Chat.css';
import React from 'react';
import { db } from 'baqend/lib/baqend';
import {getMessages} from '../../actions/message'

class Message extends React.Component {
    render() {



        return (
            <div id="chat-message">
                <div>Name</div>
                <div>Message</div>
            </div>
        );
    }
}

export default Message

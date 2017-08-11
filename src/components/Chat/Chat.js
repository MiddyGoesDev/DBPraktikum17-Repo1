import './Chat.css';
import { db } from 'baqend/lib/baqend';
import {sendMessage, getMessages} from '../../actions/messageAction'
import Message from './Message'

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Chat extends React.Component {


    constructor(props) {
    super(props);
    this.state = {
        message: ""
    }
}

    componentWillMount() {
        this.props.actions.getMessages()
    }

     handleMessage = (event) => {
     event.preventDefault();
     this.props.actions.sendMessage(this.state.message)
     this.setState({message: ""})
 };

     handleInputChange = (event) => {
     this.setState({[event.target.name]: event.target.value})
    };

    handleMessageSend = (event) => {
        this.handleMessage(event);
        this.setState({message: ""})
    }

    render() {
        return (
            <div className="chat-room">
                <div className="chat-messages" id="chat-messages">
                    test
                    {this.props.messages.list.map(message =>
                        <div key={message.id}>
                            {message.name}: {message.message}
                        </div>
                    )}
                </div>
                <div className="chat-interface">
                    <form onChange={this.handleInputChange}>
                        <input
                           className="form-control"
                           name="message"
                           placeholder="Send a message"
                           value={this.state.message}
                          />
                        <button onClick={this.handleMessage}>Send</button>
                    </form>
                </div>
            </div>
        );
    }

}

Chat.propTypes = {
    action: PropTypes.object,
    messages: PropTypes.object
}

function mapStateToProps(state) {
    return {messages: state.messages}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({sendMessage, getMessages}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

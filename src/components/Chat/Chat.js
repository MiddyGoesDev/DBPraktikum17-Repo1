import './Chat.css';
import { db } from 'baqend/lib/baqend';
import {sendMessage} from '../../actions/message'

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Chat extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
        name: "test static user",
        message: ""
    }
}

     handleMessage = (event) => {
     event.preventDefault();
     this.props.actions.sendMessage(this.state.name, this.state.message);
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

                </div>
                <div className="chat-interface">
                    <form onChange={this.handleInputChange}>
                        <input
                           className="form-control"
                           name="message"
                           placeholder="Send a message"
                           value={this.state.message}/>
                        <button onClick={this.handleMessage}>Send</button>
                    </form>
                </div>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({sendMessage}, dispatch)}
}

export default connect(null, mapDispatchToProps)(Chat)

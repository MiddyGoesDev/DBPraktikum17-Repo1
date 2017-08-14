import './Chat.css';
import { db } from 'baqend/lib/baqend';
import {sendMessage, getMessages, clearChat} from '../../actions/messageAction' //clearChat
import React, {Component} from 'react'
import PropTypes from 'prop-types'
//import Account from "../Account/Account"

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Chat extends React.Component {

    constructor(props) {
    super(props);
//    this.subscription = null
    this.state = {
        message: ""
        }
    };

    // componentDidMount() {
    //     this.props.actions.getMessages();
    // };

     componentWillMount() {
         this.props.actions.getMessages()
         //.then((subscription) => {
             //this.subscription = subscription
            this.props.actions.sendMessage(" joined the Chat", true)
        // });

     };

     componentWillUnmount(){
        this.props.actions.sendMessage(" left the Chat", true)
        //this.props.actions.clearChat() //clearChat
        //this.subscription.unsubscribe()
    };

    componentDidUpdate () {
        var el = this.refs.chatbox;
        el.scrollTop = el.scrollHeight;
    };

     handleMessage = (event) => {
     event.preventDefault();
     this.props.actions.sendMessage(": " + this.state.message, false)
     this.setState({message: ""})
 };

     handleInputChange = (event) => {
     this.setState({[event.target.name]: event.target.value})
    };

    handleMessageSend = (event) => {
        this.handleMessage(event);
        this.setState({message: ""})
    };

    render() {
        return (
            <div className="chat-room">
                <div id="chat-messages" ref="chatbox">
                    {this.props.messages.list.map(message => //mapt name : nachricht in chat
                        <div key={message.id}>
                            {message.name}{message.message}
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
/**
    mapStateToProps: Connects a React component to a Redux store, the new component will subscribe to
    Redux store updates. This means that any time the store is updated, mapStateToProps
    will be called.
**/
function mapStateToProps(state) {
    return {messages: state.messages}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({sendMessage, getMessages, clearChat}, dispatch)} //clearChat
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

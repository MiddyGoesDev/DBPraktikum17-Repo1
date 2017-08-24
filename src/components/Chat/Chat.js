import './Chat.css';
import {sendMessage, getMessages} from '../../actions/message';
import React from 'react';
import PropTypes from 'prop-types';
import {Input, Button} from 'semantic-ui-react';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Chat extends React.Component {

/*
*Setting the initial state of the written message to an empty String
*/
    constructor(props) {
        super(props);
        this.state = {
            message: "",
          }
    };

/*
*Subscribes to the stream of messages to get alerted on changes
*/
    componentWillMount() {
        this.props.actions.getMessages().then((sub) => this.messageStream = sub);
    };

/*
*If a meesage gets inserted, the chatbox will be shown at the very bottom with the latest message
*/
    // componentDidUpdate() {
    //     let el = this.refs.chatbox;
    //     el.scrollTop = el.scrollHeight;
    // };

 /*
 *Unsubscribes to the stream of messages to no longer get alerted on changes
 */
    componentWillUnmount(){
        this.messageStream.unsubscribe();
    }

  /*
  *Sends a message with the given message from the inputfield and resets the message field with an empty string.
  */
    handleMessage = (event) => {
        event.preventDefault();
        this.props.actions.sendMessage(": " + this.state.message);
        this.setState({message: ""});
        document.getElementById("chat-input").focus();
    };

    /*
    *Sets the message field with the given written message
    */
    handleInputChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    /*
    *@return Returns the Layout of the Chatbox with every message and the chat-interface with a inputfield and a submitbutton
    *Takes the list of messages and maps every message with its name and returns the created div
    *Takes every change from the inputfield and executes the handleInputChange function
    *Takes the value of the Inputfield and executes the handleMessage function
    */
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
                <div id="chat-interface" className="chat-interface">
                    <form onChange={this.handleInputChange} >
                        <Input
                            name="message"
                            id="chat-input"
                            placeholder="Send a message"
                            value={this.state.message}
                            className="input-field"
                        />
                        <Button primary onClick={this.handleMessage}>Send</Button>
                    </form>
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    action: PropTypes.object,
    messages: PropTypes.object
};
/**
 mapStateToProps: Connects a React component to a Redux store, the new component will subscribe to
 Redux store updates. This means that any time the store is updated, mapStateToProps
 will be called.
 **/
function mapStateToProps(state) {
    return {messages: state.messages}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({sendMessage, getMessages}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

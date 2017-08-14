import './Chat.css';
import {sendMessage, getMessages, clearChat} from '../../actions/messageAction';
import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
    };

    componentWillMount() {
        this.props.actions.getMessages();
        this.props.actions.sendMessage(" joined the Chat", true);
    };

    componentWillUnmount() {
        this.props.actions.sendMessage(" left the Chat", true);
    };

    componentDidUpdate() {
        let el = this.refs.chatbox;
        el.scrollTop = el.scrollHeight;
    };

    handleMessage = (event) => {
        event.preventDefault();
        this.props.actions.sendMessage(": " + this.state.message, false);
        this.setState({message: ""});
    };

    handleInputChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
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
};

/**
 mapStateToProps: Connects a React component to a Redux store, the new component will subscribe to
 Redux store updates. This means that any time the store is updated, mapStateToProps
 will be called.
 **/
function mapStateToProps(state) {
    return {messages: state.messages};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({sendMessage, getMessages, clearChat}, dispatch)}; //clearChat
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

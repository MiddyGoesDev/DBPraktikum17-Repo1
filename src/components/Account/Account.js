import './Account.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {
    login,
    register,
    logout,
    createCharacter,
    createEquipment,
    createStatistics
} from '../../actions/auth'
import {sendMessage} from '../../actions/message'
import {Button, Card, Form, Grid, Header, Message, Segment} from "semantic-ui-react";

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            info: "",
            error: false
        }
    }

    handleInputChange = (event) => {
        let message = this.state.info;
        let invalidCharacters = /[^a-z0-9]/i;

        if (event.target.name === 'username') {
            if (event.target.value.length > 9) {
                message = 'Please select a username shorter than 10 letters.';
            } else if (invalidCharacters.test(event.target.value)) {
                message = 'Please select a username with only alphanumeric characters.';
            }
            else {
                message = '';
            }
        }
        this.setState({
            [event.target.name]: event.target.value,
            info: message,
            error: message.length !== 0
        })
    };

    handleLogin = (event) => {
        event.preventDefault();
        if (this.state.username === "" || this.state.password === "") {
            this.setState({
                info: "Please enter a valid username and password."
            });
        }
        else {
            if (!this.state.error) {
                this.props.actions.login(this.state.username, this.state.password).then(result => {
                        this.setState({
                            username: "",
                            password: "",
                            info: ""
                        });
                        this.props.actions.sendMessage(" has logged in.")
                    },
                    err => {
                        this.setState({
                            info: err.message
                        });
                    });
            }
        }
    };

    handleRegister = (event) => {
        event.preventDefault();
        if (this.state.username === "" || this.state.password === "") {
            this.setState({
                info: "Please enter a valid username and password."
            });
        } else
        if (!this.state.error) {
                    this.props.actions.register(this.state.username, this.state.password)
                        .then(user => this.props.actions.createCharacter(user)
                            .then(character => this.props.actions.createEquipment(character)
                                .then(equipment => this.props.actions.createStatistics(character, this.state.username)
                                    .then(this.setState({
                                        username: null,
                                        password: null,
                                        info: ""

                                    })
                                )
                            )
                        ), err => this.setState({
                            info: err.message
                        }));
                    }
    };

    handleLogout = (event) => {
        this.props.actions.logout();
        this.props.actions.sendMessage(" has logged out.");
        this.state = {
            username: "",
            password: "",
            info: "",
            error: false
        }
    };

    render() {
        return (
            <div className="account" style={{height: '90%'}}>
                <Grid textAlign='center' style={{height: '80%'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        {this.props.auth.isLoggedIn ? (
                            <Card fluid style={{padding: '20px'}}>
                                <Header size='large' style={{paddingTop: '10px'}}>
                                    Hey {this.props.user.username}
                                </Header>
                                <p style={{paddingTop: '10px'}}>
                                    <Button size='large' color='primary' onClick={this.handleLogout}>
                                        Logout
                                    </Button>
                                </p>
                            </Card>
                        ) : (
                            <div>
                                <Form size='large' onChange={this.handleInputChange}>
                                    <Segment stacked>
                                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Username'
                                                    name="username" id="username"/>
                                        <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password'
                                                    name="password" type='password' id="password"/>
                                        <p id="err">{this.state.info}</p>
                                        <Button color='primary' fluid size='large' onClick={this.handleLogin}>
                                            Login
                                        </Button>
                                    </Segment>
                                </Form>
                                <Message>
                                    New to us? <a href='#' onClick={this.handleRegister}>Sign Up</a>
                                </Message>
                            </div>
                        )}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

Account.propTypes = {user: PropTypes.object};

function mapStateToProps(state) {
    return {auth: state.auth, user: state.auth.user}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            login,
            register,
            logout,
            createCharacter,
            createEquipment,
            createStatistics,
            sendMessage
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)

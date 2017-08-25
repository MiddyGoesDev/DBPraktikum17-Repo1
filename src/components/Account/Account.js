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

  /**
  * Initializes the fields with empty values
  */
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            info: "",
            error: false
        }
    }
    /**
    *Checks if the username input is shorter than 10 letters and or has only alphabetical chars.
    * If one of the above should be false, an error message gets displayed vie setState.
    */
    handleInputChange = (event) => {
        let message = this.state.info;
        let invalidCharacters = /[^a-z0-9]/i;
        let err = this.state.error;

        if (event.target.name === 'username') {
            if (event.target.value.length > 9) {
                message = 'Please select a username shorter than 10 letters.';
                err = true;
            } else if (invalidCharacters.test(event.target.value)) {
                message = 'Please select a username with only alphanumeric characters.';
                err = true;
            }
            else {
                message = '';
                err = false;
            }
        }
        this.setState({
            [event.target.name]: event.target.value,
            info: message,
            error: err
        })
    };
    /**
    * Gets called when the login button is pressed. If one of the input fields should be empty or the
    * username and password dont match, an error message  gets displayed via setState. On sucess the value of the
    * input fields are getting reseted.
    */
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
                    }
                );
            }
        }
    };

    /**
    * Gets called when the sign up button is pressed. If one of the input fields should be empty or the username
    * already exists in the db, an error message gets displayed. On sucess the inpiut fields are getting reseted.
    */
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
                                        username: "",
                                        password: "",
                                        info: ""

                                    })
                                )
                            )
                        ), err => this.setState({
                            info: err.message
                        })
                    );
                }
            };

    /**
    * Gets called when the logot button is pressed. The input fields are getting reseted
    */
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

    /**
    * This component has tow different states it can display. It either shows a screen after a sucessfull
    * registration or login. If there hasnt been a sucessfull login or registration, it renders two input
    * fields, one fore the username and one for the password where the user then either can sign up or log in.
    */
    render() {
        return (
            <div className="account" style={{height: '90%'}}>
                <Grid textAlign='center' style={{height: '80%'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        {this.props.auth.isLoggedIn ? ( //if user has sucessfully been registered or logged in display:
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
                        ) : ( //if the user has not sucessfully been registered of logged in display:
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

/**
* During runtime, this will throw a warning if the props in this definition dont match with the props
* the component got passed.
*/
Account.propTypes = {user: PropTypes.object};

/**
* This makes the component subscribe to the redux store, meaning that anytime the state of the store
* gets updated, mapStateToProps will be called, updating the state of the component accordingly
* @param state the state of the redux store
*/
function mapStateToProps(state) {
    return {auth: state.auth, user: state.auth.user}
}

/**
* This will be re-invoked whenever the connected component (Account) receives new props. This
* works the other way arround compared to how mapStateToProps works.
*/
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

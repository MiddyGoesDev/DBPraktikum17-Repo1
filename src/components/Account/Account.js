import './Account.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {login, register, logout, createCharacter, createStatistics, checkForExsistence} from '../../actions/auth'
import {Button, Card, Form, Grid, Header, Message, Segment} from "semantic-ui-react";

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
        }
    }

    handleInputChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    handleLogin = (event) => {
        event.preventDefault();
        this.props.actions.login(this.state.username, this.state.password);
    };

    handleRegister = (event) => {
        event.preventDefault();
        if(this.props.actions.checkForExsistence(this.state.username)){
        this.props.actions.register(this.state.username, this.state.password)
            .then(user => this.props.actions.createCharacter(user)
                .then(character => this.props.actions.createStatistics(character, this.state.username)));
              }
    };

    handleLogout = (event) => {
        this.props.actions.logout();
    };

    render() {
        return (
            <div className="account" style={{height: '90%'}}>
                <Grid textAlign='center' style={{ height: '80%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
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
                                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' name="username"/>
                                        <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' name="password" type='password'/>

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
    return {actions: bindActionCreators({login, register, logout, createCharacter, createStatistics, checkForExsistence}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)

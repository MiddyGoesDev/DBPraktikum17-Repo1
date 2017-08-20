import './App.css';
import React, {Component} from 'react';
import logo from './react_baqend.svg';

import {Route, Switch} from 'react-router';
import {BrowserRouter, NavLink} from 'react-router-dom';

import {Provider} from 'react-redux';
import createStore from './store/store';

import Account from './components/Account/Account';
import GameChat from './components/GameChat';
import Ranking from './components/Ranking';
import Profile from './components/Profile';

const store = createStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <div className="row around-xs" id="header">
                            <div className="col-xs-2" id="left">
                                <img src={logo} id="logo" alt="logo"/>
                                <br/>
                            </div>

                            <div className="col-xs-2" id="navbar">
                                <NavLink
                                    to="/account">
                                    Account
                                </NavLink>

                                <NavLink
                                    exact={true}
                                    to="/">
                                    Game
                                </NavLink>

                                <NavLink
                                    to="/ranking">
                                    Ranking
                                </NavLink>

                                <NavLink
                                    to="/profile">
                                    Profile
                                </NavLink>

                            </div>
                            <div className="col-xs-2">
                            </div>

                        </div>
                        <Switch>
                            <Route exact path="/" component={GameChat}/>
                            <Route path="/account" component={Account}/>
                            <Route path="/ranking" component={Ranking}/>
                            <Route path="/profile" component={Profile}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}

import './App.css';
import React, {Component} from 'react';
import logo from './react_baqend.svg';

import {Route, Switch} from 'react-router';
import {BrowserRouter, NavLink} from 'react-router-dom';

import {Provider} from 'react-redux';
import createStore from './store/store';

import Account from './components/Account/Account';
import GameChat from './components/GameChat';

const store = createStore();

class App extends Component {
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
                                    style={{padding: '0 8px'}}
                                    activeStyle={{textDecoration: 'underline'}}
                                    to="/account">
                                    Account
                                </NavLink>

                                <NavLink
                                    style={{padding: '0 8px'}}
                                    activeStyle={{textDecoration: 'underline'}}
                                    exact={true}
                                    to="/">
                                    Game
                                </NavLink>

                            </div>
                            <div className="col-xs-2">
                            </div>

                        </div>
                        <Switch>
                            <Route exact path="/" component={GameChat}/>
                            <Route path="/account" component={Account}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default App;

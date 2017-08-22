import './App.css';
import React, {Component} from 'react';

import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux';
import createStore from './store/store';

import Account from './components/Account/Account';
import GameChat from './components/GameChat';
import Ranking from './components/Ranking';
import Profile from './components/Profile';
import NavBar from "./components/Navigation/NavBar";
import Footer from "./components/Navigation/Footer";

const store = createStore();

export default class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <NavBar/>
                        <Switch>
                            <Route exact path="/" component={GameChat}/> //startscreen
                            <Route path="/account" component={Account}/>
                            <Route path="/ranking" component={Ranking}/>
                            <Route path="/profile" component={Profile}/>
                        </Switch>
                        <Footer/>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}

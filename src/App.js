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

// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
// import {sendMessage} from './actions/message';

const store = createStore();

export default class App extends Component {

    // onAppInit(){
    //     this.props.actions.sendMessage(" has joined the Chat", false)
    // }
    //onEnter={this.onAppInit()}

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <NavBar/>
                        <Switch>
                            <Route exact path="/" component={GameChat} />
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

// function mapDispatchToProps(dispatch) {
//     return {actions: bindActionCreators({sendMessage}, dispatch)} //clearChat
// }
//
// connect(null, mapDispatchToProps)(App)

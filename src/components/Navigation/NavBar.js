import logo from '../../react_baqend.svg';
import Game from '../Game/Game';
import * as React from 'react';
import {NavLink, withRouter} from "react-router-dom";
import {logout} from "../../actions/auth";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button} from "semantic-ui-react";
import {leave} from "../../actions/character";

class NavBar extends React.Component {

    /*
    * If the Logout button in the navbar gets clicked, those actions have to be executed
    */
    handleLogout = (event) => {
        this.props.actions.leave();
        Game.closeGame();
        this.props.actions.logout();
    };

    /*
    * Renders the Links on the top of the page which lead to the according components
    */
    render() {
        return (
            <div className="ui secondary menu">
                <NavLink className="item" to="/" style={{background: 'none'}}>
                    <img src='./assets/Logo2.png' id="logo" alt="logo" style={{height: '50px', width: '170px'}}/>
                </NavLink>

                <div className="menu" style={{marginLeft: 'auto'}}>
                    <NavLink className="item" activeClassName="active" to="/account">
                        Account
                    </NavLink>
                    <NavLink className="item" activeClassName="active" exact={true} to="/">
                        Game
                    </NavLink>
                    <NavLink className="item" activeClassName="active" to="/ranking">
                        Ranking
                    </NavLink>
                    {this.props.auth.isLoggedIn ? ( //only if the user is logged in he is able to inspect his profile
                        <NavLink className="item" activeClassName="active" to="/profile">
                            Profile
                        </NavLink>
                    ) : (<div></div>)
                    }
                </div>

                {this.props.auth.isLoggedIn ? ( //If the user is logged in display an logout button, vice versa
                    <div className="right item">
                        <Button color='primary' onClick={this.handleLogout}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <NavLink className="right item" activeClassName="active" to="/account" style={{background: 'none'}}>
                        <Button color='primary'>
                            Login
                        </Button>
                    </NavLink>
                    )
                }
            </div>
        );
    }
}

/*
* This makes the component subscribe to the redux store, meaning that anytime the state of the store
* gets updated, mapStateToProps will be called, updating the state of the component accordingly
* @param state the state of the redux store
*/
function mapStateToProps(state) {
    return {auth: state.auth, user: state.auth.user}
}

/*
* This will be re-invoked whenever the connected component (Account) receives new props. This
* works the other way arround compared to how mapStateToProps works.
*/
function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({logout, leave}, dispatch)}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))

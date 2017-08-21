import logo from '../../react_baqend.svg';
import * as React from 'react';
import {NavLink} from "react-router-dom";
import {logout} from "../../actions/auth";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button} from "semantic-ui-react";

class NavBar extends React.Component {

    handleLogout = (event) => {
        this.props.actions.logout();
    };

    render() {
        return (
            <div className="ui secondary menu">
                <NavLink className="item" to="/" style={{background: 'none'}}>
                    <img src={logo} id="logo" alt="logo" style={{width: '135px'}}/>
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
                    <NavLink className="item" activeClassName="active" to="/profile">
                        Profile
                    </NavLink>
                </div>

                {this.props.auth.isLoggedIn ? (
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

function mapStateToProps(state) {
    return {auth: state.auth, user: state.auth.user}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({logout}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

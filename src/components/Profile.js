import './Profile.css';

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { db } from 'baqend/lib/baqend';
import {getStatsKill, getStatsDeaths, getStatsExp} from '../actions/profileAction' //clearChat


import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //user:db.User.me.username
        }
    }

    componentWillMount(){
        debugger;
        this.props.actions.getStatsKill()
        console.log(this.props.actions.getStatsKill());
    }



    render() {
        return (
            <div className="profile">
                <div className="main-profile">
                    <div className="picstats">
                        <div className="profile-pic">
                            profile-pic
                        </div>

                        <div className="statistics">
                        Stats
                        </div>
                    </div>

                    <div className="equip">
                        equip
                    </div>
                </div>

                <div className="spellbar">
                    spellbar
                </div>
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     return {messages: state.messages};
// }

Profile.propTypes = {
    action: PropTypes.object,
    statistics: PropTypes.object
};

function mapStateToProps(state) {
    return {statistics: state.statistics};
}


function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({getStatsKill}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {getStats, getProfileName} from '../actions/profile'



import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            kills: null,
            deaths: null,
            exp: null,
            kd: null,
            playTime: null,
            user: null
        }
    }

    componentWillMount(){
        this.props.actions.getStats().then((stats) => {
              this.setState({
                  kills: stats.kills,
                  deaths: stats.deaths,
                  exp: stats.xp,
                  kd: stats.kd,
                  playTime: stats.playingTime,
                  user: stats.username
        })
      })
    }


    render() {
        return (
            <div className="profile">
                <div className="main-profile">
                    <div className="picstats">
                        <div className="profile-pic">
                            <h2>{this.state.user}s Profile</h2>
                        </div>

                        <div className="statistics">
                        <h2>Statistics</h2>
                        Kills: {this.state.kills}<br/>
                        Deaths: {this.state.deaths}<br/>
                        Total Experience gained: {this.state.exp}<br/>
                        KD: {this.state.kd}<br/>
                        Total Time spend: {this.state.playTime}
                        </div>
                    </div>

                    <div className="equip">
                        <div className="head">
                        head
                        </div>
                        <div className="arms">
                        arms
                        </div>
                        <div className="shoulders">
                        shoulders
                        </div>
                        <div className="torso">
                        torso
                        </div>
                        <div className="pants">
                        pants
                        </div>
                        <div className="feet">
                        feet
                        </div>
                    </div>
                </div>

                <div className="spellbar">
                    <div className="spell"/>
                    <div className="spell"/>
                    <div className="spell"/>
                    <div className="spell"/>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    action: PropTypes.object,
    statistics: PropTypes.object
};

function mapStateToProps(state) {
    return {statistics: state.statistics};
}


function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({getStats, getProfileName}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

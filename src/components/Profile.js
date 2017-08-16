import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {getStats} from '../actions/profile'


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
        this.props.actions.getStats().then((result) => {
            this.setState({
                kills: result.kills,
                deaths: result.deaths,
                exp: result.xp,
                kd: result.kills/(result.deaths +1),
                playTime: result.playingTime,
                user: result.username
            })
        })
    }


    render() {
      console.log(this.state.user);

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
    return {actions: bindActionCreators({getStats}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

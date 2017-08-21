import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {getStats, getProfileName} from '../actions/profile'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Statistics from './Profile/Statistics';
import Equipment from './Profile/Equipment';
import {Grid} from "semantic-ui-react";

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

    componentWillMount() {
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
            <Grid centered style={{height: '90%'}}>
                <div className="two wide column"><Statistics user={{name: this.state.user}}/></div>
                <div className="six wide column"><Equipment/></div>
            </Grid>
        );
        return (
            <div className="ui grid cards centered" style={{height: '90%'}}>
                <div className="two wide column"><Statistics user={{name: this.state.user}}/></div>
                <div className="six wide column"><Equipment/></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

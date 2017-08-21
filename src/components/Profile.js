import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {myStatistics} from '../actions/profile'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Statistics from './Profile/Statistics';
import Equipment from './Profile/Equipment';
import {Grid} from "semantic-ui-react";

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        this.props.actions.myStatistics().then((stats) => {
            this.setState({
                username: stats.username,
                kills: stats.kills,
                deaths: stats.deaths,
                exp: stats.xp,
                kd: stats.kd,
                playingTime: stats.playingTime
            })
        })
    }

    render() {
        return (
            <Grid columns={10} centered style={{height: '90%'}}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Statistics
                            user={{name: this.state.username}}
                            items={[
                                {label: 'Kills', value: this.state.kills},
                                {label: 'Deaths', value: this.state.deaths},
                                {label: 'Total Experience', value: this.state.exp},
                                {label: 'KD', value: this.state.kd},
                                {label: 'Time spend', value: Statistics.timePlayed(this.state.playingTime)},
                            ]}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Equipment/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
    return {actions: bindActionCreators({myStatistics}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

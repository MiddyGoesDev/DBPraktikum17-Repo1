import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {myStatistics, myCharacter} from '../actions/profile'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Statistics from './Profile/Statistics';
import Equipment from './Profile/Equipment';
import Inventory from './Profile/Inventory'
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
                playingTime: stats.playingTime
            })
        });
        this.props.actions.myCharacter().then((char) => {
          this.setState({
            level: char.level,
            vitality: char.vitality,
            strength: char.strength,
            dexterity: char.dexterity,
            intelligence: char.intelligence
          })
        });
    }

    render() {
        return (
            <Grid columns={10} centered style={{height: '90%'}}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Statistics
                            user={{name: this.state.username}}
                            items={[
                                {label: 'Total Cows killed', value: this.state.kills},
                                {label: 'Vitality', value: this.state.vitality},
                                {label: 'Strength', value: this.state.strength},
                                {label: 'Dexterity', value: this.state.dexterity},
                                {label: 'Intelligence', value: this.state.intelligence},
                                {label: 'Level', value: this.state.level},
                                {label: 'Time spend', value: Statistics.timePlayed(this.state.playingTime)},
                            ]}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Equipment/>
                        <Inventory/>
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
    return {actions: bindActionCreators({myStatistics, myCharacter}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

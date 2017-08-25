import './Profile.css';

import React from 'react'
import PropTypes from 'prop-types'
import {myStatistics, myCharacter, equipment} from '../actions/profile'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Statistics from './Profile/Statistics';
import Equipment from './Profile/Equipment';
import Inventory from './Profile/Inventory'
import {Grid} from "semantic-ui-react";

class Profile extends React.Component {

    /**
    *Initializes the state as an empty list
    */
    constructor(props) {
        super(props);
        this.state = {}
    }
     /**
     *TODO
     * 1) gets the values that get displayed in the profile out of the statistics, from the user that is loged in
     * 2) gets the values that get display in the profile out of the character, from the user that is loged in
     * 3) calculates the values to be displayed with bonuses from the equipment
     */
    componentWillMount() {
        this.props.actions.myStatistics().then(statistics =>
            this.props.actions.myCharacter().then(character => {
                this.props.actions.equipment().then(equipment => {
                    let vitality = character.vitality;
                    let strength = character.strength;
                    let dexterity = character.dexterity;
                    let intelligence = character.intelligence;

                    Equipment.body().forEach(part => {
                        if (equipment[part] !== null) {
                            vitality += equipment[part].vitality;
                            strength += equipment[part].strength;
                            dexterity += equipment[part].dexterity;
                            intelligence += equipment[part].intelligence;
                        }
                    });

                    this.setState({
                        username: statistics.username,
                        level: character.level,
                        vitality: vitality,
                        strength: strength,
                        dexterity: dexterity,
                        intelligence: intelligence,
                        kills: statistics.kills,
                        playingTime: statistics.playingTime
                    })
                })
            })
        );
    }

     /**
     * Renders the Statistics on the left side with the two components inventory and equipment on the right side
     */
    render() {
        return (
            <Grid columns={10} centered style={{height: '90%'}}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Statistics //displays the values loaded into the components state
                            user={{name: this.state.username}}
                            items={[
                                {label: 'Level', value: this.state.level},
                                {label: 'Vitality', value: this.state.vitality},
                                {label: 'Strength', value: this.state.strength},
                                {label: 'Dexterity', value: this.state.dexterity},
                                {label: 'Intelligence', value: this.state.intelligence},
                                {label: 'Total Cows killed', value: this.state.kills},
                                {label: 'Time spend', value: Statistics.timePlayed(this.state.playingTime)},
                            ]}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Equipment/>
                    </Grid.Column>
                </Grid.Row>
                <Inventory/>
            </Grid>
        );
    }
}

/**
* During runtime, this will throw a warning if the props in this definition dont match with the props
* the component got passed.
*/
Profile.propTypes = {
    action: PropTypes.object,
    statistics: PropTypes.object
};

/**
* This makes the component subscribe to the redux store, meaning that anytime the state of the store
* gets updated, mapStateToProps will be called, updating the state of the component accordingly
* @param state the state of the redux store
*/
function mapStateToProps(state) {
    return {statistics: state.statistics};
}

/**
* This will be re-invoked whenever the connected component (Account) receives new props. This
* works the other way arround compared to how mapStateToProps works.
*/
function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({myStatistics, myCharacter, equipment}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

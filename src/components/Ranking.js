import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {
    getStatsByKillsDsc,
    getStatsByKillsAsc,
    getStatsByProfileDsc,
    getStatsByProfileAsc,
    getStatsByPlayingTimeAsc,
    getStatsByPlayingTimeDsc,
    getStatistics
} from '../actions/ranking'
import {myStatistics, loadCharacter, getEquipment} from '../actions/profile';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Grid, Label, Table} from 'semantic-ui-react';
import Statistics from "./Profile/Statistics";
import Equipment from './Profile/Equipment';
import {me} from "../actions/auth";


class Ranking extends React.Component {

    /**
     * Sets both the rankings' profile and the ranking itself to an empty state
     * the click fields are tracking the current order of the table, ascending and descending
     */
    constructor(props) {
        super(props);
        this.state = {
            ranking: [],
            profileClicks: 1,
            killsClicks: 0,
            playingTimeClicks: 1,
            currentProfileName: null,
            kd: null,
            exp: null,
            kills: null,
            deaths: null,
            playingTime: null,
            me: null
        }
    }

    /**
     * Initializes the default sorting for the ranking as kills in ascending order and
     * initializes the default profile with the stats of the logged in User
     */
    componentWillMount() {
        //gets the values for the profile of the user that is logged in
        this.props.actions.getStatsByKillsAsc().then(result =>
            this.props.actions.myStatistics().then(statistics =>
                this.props.actions.loadCharacter(statistics.character).then(character =>
                    this.props.actions.getEquipment(character).then(equipment => {
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
                            ranking: result, //the list of arrays in which all the users in the ranking are displayed
                            currentProfileName: statistics.username,
                            me: statistics.username,
                            kills: statistics.kills,
                            deaths: statistics.deaths,
                            playingTime: statistics.playingTime,
                            level: character.level,
                            vitality: vitality,
                            strength: strength,
                            dexterity: dexterity,
                            intelligence: intelligence
                        })
                    })
                )
            )
        );
    }

    /**
     * Sorts the ranking by the profile
     * each click reverses the order
     * @param event
     */
    handleProfile = (event) => {
        event.preventDefault();
        if (this.state.profileClicks === 1) {
            this.props.actions.getStatsByProfileDsc().then((result) => {
                this.setState({
                    ranking: result,
                    profileClicks: 0
                })
            })
        }
        else {
            this.props.actions.getStatsByProfileAsc().then((result) => {
                this.setState({
                    ranking: result,
                    profileClicks: 1
                })
            })
        }
    };

    /**
     * Sorts the ranking by the kills
     * each click reverses the order
     * @param event
     */
    handleKills = (event) => {
        event.preventDefault();
        if (this.state.killsClicks === 1) {
            this.props.actions.getStatsByKillsDsc().then((result) => {
                this.setState({
                    ranking: result,
                    killsClicks: 0
                })
            })
        }
        else {
            this.props.actions.getStatsByKillsAsc().then((result) => {
                this.setState({
                    ranking: result,
                    killsClicks: 1
                })
            })
        }
    };

    /**
     * Sorts the ranking by the played time
     * each click reverses the order
     * @param event
     */
    handlePlayingTime = (event) => {
        event.preventDefault();
        if (this.state.playingTimeClicks === 1) {
            this.props.actions.getStatsByPlayingTimeDsc().then((result) => {
                this.setState({
                    ranking: result,
                    playingTimeClicks: 0
                })
            })
        }
        else {
            this.props.actions.getStatsByPlayingTimeAsc().then((result) => {
                this.setState({
                    ranking: result,
                    playingTimeClicks: 1
                })
            })
        }
    };

    /**
     * gets the character statistics for the user clicked on in the ranking and displays the information
*in the window next to the ranking
     * @param event
     */
    displayProfile = (event) => {
        let userName = event.target.parentNode.getAttribute('name'); //gets the username of the user clicked on

        this.props.actions.getStatistics(userName).then(statistics => //finds the statistics for the user clicked on
            this.props.actions.loadCharacter(statistics.character).then(character =>
                this.props.actions.getEquipment(character).then(equipment => {
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
                        currentProfileName: statistics.username,
                        kills: statistics.kills,
                        deaths: statistics.deaths,
                        playingTime: statistics.playingTime,
                        level: character.level,
                        vitality: vitality,
                        strength: strength,
                        dexterity: dexterity,
                        intelligence: intelligence
                    })
                })
            )
        );
    };

    /**
     * Renders the ranking list and the window to inscpect the users statistics, Grid gets imported from Semantic UI
     */
    render() {
        var i = 0;
        return (
            <Grid stackable sivided centered style={{height: '90%'}}>
                <Grid.Column width={6}>
                    <Table sortable celled>
                        <Table.Header style={{backgroundColor: '#f5f5f5'}}>
                            <Table.Row>
                                <Table.Cell>
                                    #
                                </Table.Cell>
                                <Table.Cell>
                                    <button className="ui button"
                                            style={{backgroundColor: '#f5f5f5'}}
                                            onClick={this.handleProfile}>
                                        <h3>Username</h3>
                                    </button>
                                </Table.Cell>
                                <Table.Cell>
                                    <button className="ui button"
                                            style={{backgroundColor: '#f5f5f5'}}
                                            onClick={this.handlePlayingTime}>
                                        <h3>Total Time</h3>
                                    </button>
                                </Table.Cell>
                                <Table.Cell>
                                    <button className="ui button"
                                            style={{backgroundColor: '#f5f5f5'}}
                                            onClick={this.handleKills}>
                                        <h3>Cow Kills</h3>
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.ranking.map(statistics =>
                                <Table.Row
                                    id={statistics.id}
                                    key={statistics.id}
                                    name={statistics.username}
                                    onClick={this.displayProfile}>
                                    <Table.Cell>
                                        {this.state.me === statistics.username ? (<Label ribbon>{++i}</Label>) : ++i}
                                    </Table.Cell>
                                    <Table.Cell>{statistics.username}</Table.Cell>
                                    <Table.Cell>{Statistics.timePlayed(statistics.playingTime)}</Table.Cell>
                                    <Table.Cell>{statistics.kills}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Statistics
                        user={{name: this.state.currentProfileName}}
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
            </Grid>
        );
    }
}

/**
* During runtime, this will throw a warning if the props in this definition dont match with the props
* the component got passed.
*/
Ranking.propTypes = {
    action: PropTypes.object,
    rankings: PropTypes.object
};

/**
* This makes the component subscribe to the redux store, meaning that anytime the state of the store
* gets updated, mapStateToProps will be called, updating the state of the component accordingly
* @param state the state of the redux store
*/
function mapStateToProps(state) {
    return {rankings: state.rankings};
}

/**
* This will be re-invoked whenever the connected component (Ranking) receives new props. This
* works the other way arround compared to how mapStateToProps works.
*/
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getStatsByKillsAsc,
            getStatsByKillsDsc,
            getStatsByProfileDsc,
            getStatsByProfileAsc,
            getStatsByPlayingTimeAsc,
            getStatsByPlayingTimeDsc,
            myStatistics,
            getStatistics,
            getEquipment,
            loadCharacter,
            me
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

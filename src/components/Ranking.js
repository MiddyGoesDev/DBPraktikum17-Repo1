
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
import {myStatistics, loadCharacter} from '../actions/profile';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Grid, Label, Table} from 'semantic-ui-react';
import Statistics from "./Profile/Statistics";
import {me} from "../actions/auth";


class Ranking extends React.Component {

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

    componentWillMount() {

      this.props.actions.getStatsByProfileAsc().then(result =>
      this.props.actions.myStatistics().then(statistics => this.props.actions.loadCharacter(statistics.character)
      .then(character =>
         this.setState({
           ranking: result,
             currentProfileName: statistics.username,
             me: statistics.username,
             kills: statistics.kills,
             deaths: statistics.deaths,
             playingTime: statistics.playingTime,
             level: character.level,
             vitality: character.vitality,
             strength: character.strength,
             dexterity: character.dexterity,
             intelligence: character.intelligence
           }))));
    }

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

    displayProfile = (e) => {
        let userName = e.target.parentNode.getAttribute('name');


         this.props.actions.getStatistics(userName).then(statistics => this.props.actions.loadCharacter(statistics.character)
         .then(character =>
            this.setState({
                currentProfileName: userName,
                kills: statistics.kills,
                deaths: statistics.deaths,
                playingTime: statistics.playingTime,
                level: character.level,
                vitality: character.vitality,
                strength: character.strength,
                dexterity: character.dexterity,
                intelligence: character.intelligence
              })));
    };

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
            </Grid>
        );
    }
}

Ranking.propTypes = {
    action: PropTypes.object,
    rankings: PropTypes.object
};

function mapStateToProps(state) {
    return {rankings: state.rankings};
}

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
            loadCharacter,
            me
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

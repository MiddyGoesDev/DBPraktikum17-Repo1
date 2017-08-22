
import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {
    getStatsByKDDsc,
    getStatsByKDAsc,
    getStatsByProfileDsc,
    getStatsByProfileAsc,
    getStatsByXPAsc,
    getStatsByXPDsc,
    getStatistics
} from '../actions/ranking'
import {myStatistics} from '../actions/profile';
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
            kdClicks: 0,
            xpClicks: 0,
            currentProfileName: null,
            kd: null,
            exp: null,
            kills: null,
            deaths: null,
            playTime: null,
            me: null
        }
    }

    componentWillMount() {
        this.props.actions.myStatistics().then(statistics => {
            this.props.actions.getStatsByProfileAsc().then((result) => {
                this.setState({
                    ranking: result,
                    currentProfileName: statistics.username,
                    me: statistics.username,
                    kills: statistics.kills,
                    deaths: statistics.deaths,
                    exp: statistics.xp,
                    kd: statistics.kd,
                    playTime: statistics.playingTime
                })
            })
        });
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

    handleKD = (event) => {
        event.preventDefault();
        if (this.state.kdClicks === 1) {
            this.props.actions.getStatsByKDDsc().then((result) => {
                this.setState({
                    ranking: result,
                    kdClicks: 0
                })
            })
        }
        else {
            this.props.actions.getStatsByKDAsc().then((result) => {
                this.setState({
                    ranking: result,
                    kdClicks: 1
                })
            })
        }
    };

    handleXP = (event) => {
        event.preventDefault();
        if (this.state.xpClicks === 1) {
            this.props.actions.getStatsByXPDsc().then((result) => {
                this.setState({
                    ranking: result,
                    xpClicks: 0
                })
            })
        }
        else {
            this.props.actions.getStatsByXPAsc().then((result) => {
                this.setState({
                    ranking: result,
                    xpClicks: 1
                })
            })
        }
    };

    displayProfile = (e) => {
        let userName = e.target.parentNode.getAttribute('name');
        this.props.actions.getStatistics(userName).then(statistics => this.setState({
            currentProfileName: userName,
            kills: statistics.kills,
            deaths: statistics.deaths,
            exp: statistics.xp,
            kd: statistics.kd,
            playTime: statistics.playingTime
        }));
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
                                            onClick={this.handleKD}>
                                        <h3>K/D</h3>
                                    </button>
                                </Table.Cell>
                                <Table.Cell>
                                    <button className="ui borderlessButton button"
                                            style={{backgroundColor: '#f5f5f5'}}
                                            onClick={this.handleXP}>
                                        <h3>Experience</h3>
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
                                    <Table.Cell>{statistics.kd}</Table.Cell>
                                    <Table.Cell>{statistics.xp}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Statistics
                        user={{name: this.state.currentProfileName}}
                        items={[
                            {label: 'Kills', value: this.state.kills},
                            {label: 'Deaths', value: this.state.deaths},
                            {label: 'Total Experience', value: this.state.exp},
                            {label: 'KD', value: this.state.kd},
                            {label: 'Time spend', value: Statistics.timePlayed(this.state.playTime)},
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
            getStatsByKDAsc,
            getStatsByKDDsc,
            getStatsByProfileDsc,
            getStatsByProfileAsc,
            getStatsByXPAsc,
            getStatsByXPDsc,
            myStatistics,
            getStatistics,
            me
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {getStatsByKD, getStatsByProfileDsc, getStatsByProfileAsc, getStatsByXP, getStatsForProfile} from '../actions/ranking'
import {getStats} from '../actions/profile'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Ranking extends React.Component {

  constructor(props){
    super(props)
      this.state = {
        ranking: [],
        profileClicks:0,
        currentProfileName: null,
        kd: null,
        exp: null,
        kills: null,
        deaths: null,
        playTime: null
    }
  }

componentWillMount(){
    this.props.actions.getStatsByKD().then((result) => {
      this.setState({
        ranking: result
      })
    })
  }

  handleProfile = (event) => {
    event.preventDefault();
    if(this.state.profileClicks==1){
      this.props.actions.getStatsByProfileDsc().then((result) => {
        this.setState({
          ranking: result,
          profileClicks:0
        })
      })
    }
    else {
      this.props.actions.getStatsByProfileAsc().then((result) => {
        this.setState({
          ranking: result,
          profileClicks:1
        })
      })
    }
  }

  handleKD = (event) => {
    event.preventDefault();
    this.props.actions.getStatsByKD().then((result) => {
      this.setState({
        ranking: result
      })
    })
  }

  handleXP = (event) => {
    event.preventDefault();
    this.props.actions.getStatsByXP().then((result) => {
      this.setState({
        ranking: result
      })
    })
  }

  displayProfile = (e) => {
    e.preventDefault();
    e = e || window.e;
    var user = ""
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
        user=cells[0].innerHTML;
        this.setState({
          currentProfileName: user
        })
      }
      this.props.actions.getStatsForProfile(user).then ((result) =>{
        this.setState({
          kd: result.kd,
          exp: result.xp,
          kills: result.kills,
          deaths: result.deaths,
          playTime: result.playingTime
        })
      })
  }

    render() {
        return (
        <div className="ranking">
            <div className="scoreboard">
              <div className="row">
              <div className="col-xs centers"><button className="Button" onClick={this.handleProfile}><b>Profile</b></button></div>
              <div className="col-xs centers"><button className="Button" onClick={this.handleKD}><b>KD</b></button></div>
              <div className="col-xs centers"><button className="Button" onClick={this.handleXP}><b>EXP</b></button></div>
              </div>
                {this.state.ranking.map(stats =>
                  <div key={stats.id}>
                  <tr onClick={this.displayProfile}>
                    <td id="username">{stats.username}</td>
                    <td>{stats.kd}</td>
                    <td>{stats.xp}</td>
                    </tr>
                  </div>
                )}
                </div>
                <div className="playerProfile">
                <div className="picstats">
                    <div className="profile-pic">
                        <h2>{this.state.currentProfileName}s Profile</h2>
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
                </div>
        </div>
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
    return {actions: bindActionCreators({getStatsByKD, getStatsByProfileDsc,getStatsByProfileAsc, getStatsByXP, getStatsForProfile}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

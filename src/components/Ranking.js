import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {getStatsByKD, getStatsByProfileDsc, getStatsByProfileAsc, getStatsByXP} from '../actions/ranking'
import {getStats} from '../actions/profile'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Ranking extends React.Component {

  constructor(props){
    super(props)
      this.state = {
        ranking: [],
        profileClicks:0,
        currentProfile: null
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

  displayProfile = (event) => {
    event.preventDefault();

  }

    render() {
        return (
        <div className="ranking">
            <div className="scoreboard">
              <div className="row">
              <div className="col-xs centers"><button onClick={this.handleProfile}><b>Profile</b></button></div>
              <div className="col-xs centers"><button onClick={this.handleKD}><b>KD</b></button></div>
              <div className="col-xs centers"><button onClick={this.handleXP}><b>EXP</b></button></div>
              </div>
                {this.state.ranking.map(stats =>
                  <div key={stats.id}>
                  <div className="row" onClick={this.displayProfile}>
                    <div className="col-xs centers">{stats.username}</div>
                    <div className="col-xs centers">{stats.kd}</div>
                    <div className="col-xs centers">{stats.xp}</div>
                    </div>
                  </div>
                )}
                </div>
                <div className="playerProfile">
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
    return {actions: bindActionCreators({getStatsByKD, getStatsByProfileDsc,getStatsByProfileAsc, getStatsByXP, getStats}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

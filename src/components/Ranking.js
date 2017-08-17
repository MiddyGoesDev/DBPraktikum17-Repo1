import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {getStatsByKD, getStatsByProfile, getStatsByXP} from '../actions/ranking'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


class Ranking extends React.Component {

  constructor(props){
    super(props)
      this.state = {
        ranking: []
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
    this.props.actions.getStatsByProfile().then((result) => {
      this.setState({
        ranking: result
      })
    })
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
                  <div className="row">
                    <div className="col-xs centers">{stats.username}</div>
                    <div className="col-xs centers">{stats.kd}</div>
                    <div className="col-xs centers">{stats.xp}</div>
                    </div>
                  </div>
                )}
                </div>
                <div className="playerProfile">
                Player Profile
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
    return {actions: bindActionCreators({getStatsByKD, getStatsByProfile, getStatsByXP}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

import './Ranking.css';
import React from 'react'
import PropTypes from 'prop-types'
import {getRanking} from '../actions/ranking'
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
    this.props.actions.getRanking().then((result) => {
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
              <div className="col-xs centers"><b>Profile</b></div>
              <div className="col-xs centers"><b>KD</b></div>
              <div className="col-xs centers"><b>XP</b></div>
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
    return {actions: bindActionCreators({getRanking}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking)

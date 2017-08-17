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
      console.log("this.state.ranking "+this.state.ranking);
        return (
        <div className="ranking">
            <div className="scoreboard">

            </div>
            <div className="playerProfile">
            Player Profile
            </div>t
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

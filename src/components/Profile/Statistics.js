import React from "react";
import {Statistic, Card, Header, Image} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {myStatistics} from "../../actions/profile";
import {connect} from "react-redux";
import PropTypes from 'prop-types'

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.props.actions.myStatistics().then((stats) => {
            this.setState({items: [
                {label: 'Kills', value: stats.kills},
                {label: 'Deaths', value: stats.deaths},
                {label: 'Total Experience', value: stats.xp},
                {label: 'KD', value: stats.kd},
                {label: 'Time spend', value: Statistics.timePlayed(stats.playingTime)},
            ]});
        });
    }

    static timePlayed(time) {
        var min = time / 60000;
        var h = Math.floor(min / 60);
        min = Math.round(min % 60);
        return h + ":" + (min.toString().length===1 ? '0' + min : min);
    }

    render() {
        return (
            <Card style={{padding: 0}}>
                <Image
                    src="./assets/avatar/matthew.png"/>
                <Card.Content style={{flexGrow: 'unset'}}>
                    <Card.Header>
                        {this.props.user.name}
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        <Header as="h4" className="ui sub header">
                            Statistics
                        </Header>
                        <Statistic.Group horizontal mini items={this.props.items}/>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}

Statistics.propTypes = {
    action: PropTypes.object
};

function mapStateToProps(state) {
    return {};
}


function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({myStatistics}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);

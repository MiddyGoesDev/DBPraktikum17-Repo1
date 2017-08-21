import React from "react";
import {Button, Card, Header, Dimmer, Image} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {getStats} from "../../actions/profile";
import {connect} from "react-redux";
import PropTypes from 'prop-types'

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        this.props.actions.getStats().then((stats) => {
            this.setState({
                kills: stats.kills,
                deaths: stats.deaths,
                exp: stats.xp,
                kd: stats.kd,
                playTime: stats.playingTime,
                user: stats.username
            })
        })
    }

    render() {
        const { active } = this.state;
        const dimmedContent = (
            <div className="center">
                <Button primary>Change</Button>
            </div>
        );
        return (
            <Card style={{padding: 0}}>
                <Dimmer.Dimmable
                    as={Image}
                    blurring
                    dimmed={active}
                    dimmer={{active, dimmedContent}}
                    onMouseEnter={() => this.setState({ active: true })}
                    onMouseLeave={() => this.setState({ active: false })}
                    src="./assets/avatar/matthew.png" />
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
                        <div className="ui horizontal statistics mini">
                        <div className="statistics">
                          <h2>Statistics</h2>
                          Kills: {this.state.kills}<br/>
                          Deaths: {this.state.deaths}<br/>
                          Total Experience: {this.state.exp}<br/>
                          KD: {this.state.kd}<br/>
                          Total Time spend: {this.state.playTime}
                         </div>
                        </div>
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
    return {actions: bindActionCreators({getStats}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);

import React from "react";
import {Button, Card, Header, Dimmer, Image} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {getStats, getProfileName} from "../../actions/profile";
import {connect} from "react-redux";
import PropTypes from 'prop-types'

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
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
                            <div className="statistic">
                                <div className="value">
                                    120
                                </div>
                                <div className="label">
                                    Vitality
                                </div>
                            </div>
                            <div className="statistic">
                                <div className="value">
                                    10
                                </div>
                                <div className="label">
                                    Damage
                                </div>
                            </div>
                            <div className="statistic">
                                <div className="value">
                                    4
                                </div>
                                <div className="label">
                                    Movement Speed
                                </div>
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
    return {actions: bindActionCreators({getStats, getProfileName}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
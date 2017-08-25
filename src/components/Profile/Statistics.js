import React from "react";
import {Statistic, Card, Header, Image} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import {myStatistics} from "../../actions/profile";
import {connect} from "react-redux";
import PropTypes from 'prop-types'

class Statistics extends React.Component {

//TODO
    constructor(props) {
        super(props);
    }
/**
*Formats a given timevalue into a representative hh:mm form
*@param time an integer that represents the time in miliseconds
*/
    static timePlayed(time) {
        var min = time / 60000;
        var h = Math.floor(min / 60);
        min = Math.round(min % 60);
        return h + ":" + (min.toString().length===1 ? '0' + min : min);
    }

/**
*gives a semantic.ui layout with a static profile picture
*@return Sets the layout for both the ranking and the profile
*/
    render() {
        return (
            <Card style={{padding: 0, minWidth: '180px'}}>
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
                        <Statistic.Group horizontal size='tiny' items={this.props.items}/>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}

/**
* During runtime, this will throw a warning if the props in this definition dont match with the props
* the component got passed.
*/
Statistics.propTypes = {
    action: PropTypes.object
};

/**
* This makes the component subscribe to the redux store, meaning that anytime the state of the store
* gets updated, mapStateToProps will be called, updating the state of the component accordingly
* @param state the state of the redux store
*/
function mapStateToProps(state) {
    return {};
}

/**
*it will be called with the store state as the first parameter and the props
*passed to the connected component as the second parameter, and will also be
*re-invoked whenever the connected component receives new props as determined
*by shallow equality comparisons.
*/
function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({myStatistics}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);

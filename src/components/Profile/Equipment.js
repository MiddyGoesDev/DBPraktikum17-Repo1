import * as React from "react";
import {Grid, Image, Rail, Segment} from "semantic-ui-react";
import {equipment, mainHand, head} from '../../actions/profile';

import './Equipment.css';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types'

class Equipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.props.actions.equipment().then(equip =>
            this.props.actions.mainHand(equip).then(mainHand =>
                this.props.actions.head(equip).then(head => {
                    this.setState({
                        mainHandSrc: './assets/items/' + this.capitalizeFirstLetter(this.toCamelCase(mainHand.name)) + '.png',
                        mainHandName: mainHand.name,
                        headSrc: './assets/items/' + this.capitalizeFirstLetter(this.toCamelCase(head.name)) + '.png',
                        headName: head.name,
                    });
                })));
    }

    toCamelCase(name) {
        return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        return (
            <Grid columns={6} centered style={{paddingLeft: '200px'}}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment className="head">
                            <p className="item-title">Head</p>
                            <Image fluid verticalAlign src={this.state.headSrc} className="item-img" />

                            <Rail position='left'>
                                <Segment className="shoulders" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Shoulders</p>
                                </Segment>
                            </Rail>

                            <Rail position='right'>
                                <Segment className="amulet">
                                    <p className="item-title">Neck</p>
                                </Segment>
                            </Rail>
                        </Segment>
                        <Segment className="torso">
                            <p className="item-title">Torso</p>
                            <Image src=''/>
                        </Segment>
                        <Segment className="belt">
                            <p className="item-title">Waist</p>
                            <Image src=''/>

                            <Rail position='left'>
                                <Segment className="ring" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Finger 1</p>
                                </Segment>
                                <Segment className="weapon" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Main-Hand</p>
                                    <Image fluid verticalAlign src={this.state.mainHandSrc} className="item-img" />
                                    <p>{this.state.name}</p>
                                </Segment>
                            </Rail>
                            <Rail position='right'>
                                <Segment className="ring">
                                    <p className="item-title">Finger 2</p>
                                </Segment>
                                <Segment className="weapon">
                                    <p className="item-title">Off-Hand</p>
                                </Segment>
                            </Rail>
                        </Segment>
                        <Segment className="pants">
                            <p className="item-title">Legs</p>
                            <Image src=''/>
                        </Segment>
                        <Segment className="boots">
                            <p className="item-title">Feet</p>
                            <Image src=''/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}


Equipment.propTypes = {
    action: PropTypes.object
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({equipment, mainHand, head}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipment);

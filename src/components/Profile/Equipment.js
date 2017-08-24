import * as React from "react";
import {Grid, Image, Rail, Segment, Card, Statistic} from "semantic-ui-react";
import {equipment} from '../../actions/profile';

import './Equipment.css';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';

class Equipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showCurrent: false,
            currentItem: '',
            currentItemSrc: '',
            currentItemVitality: 0,
            currentItemStrength: 0,
            currentItemDexterity: 0,
            currentItemIntelligence: 0
        }
    }

    static body() {
        return ['head', 'neck', 'torso', 'shoulders', 'hands', 'wrists', 'waist', 'finger_1', 'finger_2', 'legs', 'feet', 'main_hand', 'off_hand'];
    }

    componentWillMount() {
        this.props.actions.equipment().then(equip =>
            this.setState({
                mainHandSrc: './assets/items/' + Equipment.capitalizeFirstLetter(Equipment.toCamelCase(equip.main_hand.name)) + '.png',
                mainHandName: equip.main_hand.name,
                headSrc: './assets/items/' + Equipment.capitalizeFirstLetter(Equipment.toCamelCase(equip.head.name)) + '.png',
                headName: equip.head.name
            }));
    }

    static toCamelCase(name) {
        return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    onHover(part) {
        this.props.actions.equipment().then(equip => {
            if (equip[part] !== undefined) {
                this.setState({
                    showCurrent: true,
                    currentItem: equip[part].name,
                    currentItemSrc: './assets/items/' + Equipment.capitalizeFirstLetter(Equipment.toCamelCase(equip[part].name)) + '.png',
                    currentItemVitality: equip[part].vitality,
                    currentItemStrength: equip[part].strength,
                    currentItemDexterity: equip[part].dexterity,
                    currentItemIntelligence: equip[part].intelligence
                });
            }
        });
    }

    onLeave() {
        this.setState({showCurrent: false});
    }

    render() {
        return (
            <Grid columns={6} centered style={{paddingLeft: '200px'}}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment className="head">
                            <p className="item-title">Head</p>
                            <Image fluid verticalAlign src={this.state.headSrc} className="item-img"
                                   onMouseEnter={this.onHover.bind(this, 'head')}
                                   onMouseLeave={this.onLeave.bind(this)}/>

                            <Rail position='left'>
                                <Segment className="shoulders" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Shoulders</p>
                                </Segment>
                                <Segment className="wrists" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Wrists</p>
                                </Segment>
                            </Rail>

                            <Rail position='right'>
                                <Segment className="amulet">
                                    <p className="item-title">Neck</p>
                                </Segment>
                                <Segment className="hands">
                                    <p className="item-title">Hands</p>
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
                                    <Image fluid verticalAlign src={this.state.mainHandSrc} className="item-img"
                                           onMouseEnter={this.onHover.bind(this, 'main_hand')}
                                           onMouseLeave={this.onLeave.bind(this)}/>
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
                {(this.state.showCurrent ? (
                    <Card style={{position: 'absolute', marginRight: '700px'}}>
                        <Card.Content>
                            <Card.Header>
                                {this.state.currentItem}
                            </Card.Header>
                            <Card.Description>
                                <Image src={this.state.currentItemSrc}/>
                                <Statistic.Group horizontal mini items={[
                                    {label: 'Vitality', value: this.state.currentItemVitality},
                                    {label: 'Strength', value: this.state.currentItemStrength},
                                    {label: 'Dexterity', value: this.state.currentItemDexterity},
                                    {label: 'Intelligence', value: this.state.currentItemIntelligence},
                                ]}/>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                ) : '')}
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
    return {actions: bindActionCreators({equipment}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipment);

import * as React from "react";
import {Grid, Image, Segment} from "semantic-ui-react";

import './Inventory.css';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Equipment from './Equipment'
import PropTypes from 'prop-types'
import {myCharacter, getInventory} from "../../actions/profile";

class Inventory extends React.Component {


/*
*Initializes every Inventoryslot with an empty string
*/
    constructor(props) {
        super(props);
        this.state = {
            src1: '',
            src2: '',
            src3: '',
            src4: '',
            src5: '',
            src6: '',
            src7: '',
            src8: '',
            src9: '',
            src10: ''
        }
    }

/*
*Sets every Inventory slot with the name of its item for a given Character
*/
    componentWillMount() {
        this.props.actions.myCharacter().then(character =>
            this.props.actions.getInventory(character).then(inventory => {
                //console.log(inventory.length, inventory[0]);
                let state = {};
                for (let i=1; i<=10 && i<=inventory.length; i++) {
                    state['src' + i] ='./assets/items/' + Equipment.capitalizeFirstLetter(Equipment.toCamelCase(inventory[i-1].item.name)) + '.png';
                }
                //console.log('state', state);
                this.setState(state);
            }));
    }
//TODO
/*
*
*
*@return returns the images for every inventory slot
*/
    render() {
        return (
            <Grid centered style={{paddingLeft: '200px', float:'right'}}>
                <Segment className="Inventory">
                    <p className="item-title">Inventory</p>
                    <Grid.Row>
                        {[...Array(5)].map((x, i) => (
                            <Segment className="item-slot">
                                {this.state['src' + (i+1)].length===0 ? i+1 : (<Image src={this.state['src' + (i+1)]}/>)}
                            </Segment>
                        ))}
                    </Grid.Row>
                    <Grid.Row>
                        <Segment className="item-slot">6
                            <Image src={this.state.src6}/>
                        </Segment>
                        <Segment className="item-slot">7
                            <Image src={this.state.src7}/>
                        </Segment>
                        <Segment className="item-slot">8
                            <Image src={this.state.src8}/>
                        </Segment>
                        <Segment className="item-slot">9
                            <Image src={this.state.src9}/>
                        </Segment>
                        <Segment className="item-slot">10
                            <Image src={this.state.src10}/>
                        </Segment>
                    </Grid.Row>

                </Segment>
            </Grid>
        )
    }
}

Inventory.propTypes = {
    action: PropTypes.object
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({myCharacter, getInventory}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);

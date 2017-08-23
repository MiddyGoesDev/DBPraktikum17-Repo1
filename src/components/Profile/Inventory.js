import * as React from "react";
import {Grid, Image, Segment} from "semantic-ui-react";

import './Inventory.css';
import {connect} from "react-redux";

class Inventory extends React.Component{

  constructor(props) {
        super(props);
        this.state = {}
    }

  render() {
    return(
      <Grid centered style={{paddingLeft: '200px', float:'right'}}>
      <Segment className ="Inventory">
        <p className="item-title">Inventory</p>
        <Grid.Row>
            <Segment className="item-slot">1
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">2
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">3
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">4
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">5
                <Image src=""/>
            </Segment>
          </Grid.Row>
          <Grid.Row>
            <Segment className="item-slot">6
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">7
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">8
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">9
                <Image src=""/>
            </Segment>
            <Segment className="item-slot">10
                <Image src=""/>
            </Segment>
        </Grid.Row>

        </Segment>
      </Grid>
    )
  }

}

export default connect(null, null)(Inventory);

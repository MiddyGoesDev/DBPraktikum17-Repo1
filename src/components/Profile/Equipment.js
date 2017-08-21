import * as React from "react";
import {Grid, Image, Rail, Segment} from "semantic-ui-react";

import './Equipment.css';

export default class Equipment extends React.Component {

    render() {
        return (
            <Grid columns={3} style={{paddingLeft: '300px'}}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment className="head">
                            <p className="item-title">Head</p>
                            <Image src='' />

                            <Rail position='left'>
                                <Segment className="shoulders" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Shoulders</p>
                                </Segment>
                            </Rail>

                            <Rail position='right'>
                                <Segment className="amulet">
                                    <p className="item-title">Amulet</p>
                                </Segment>
                            </Rail>
                        </Segment>
                        <Segment className="torso">
                            <p className="item-title">Torso</p>
                            <Image src='' />
                        </Segment>
                        <Segment className="belt">
                            <p className="item-title">Belt</p>
                            <Image src='' />

                            <Rail position='left'>
                                <Segment className="ring" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Ring 1</p>
                                </Segment>
                                <Segment className="weapon" style={{marginLeft: 'auto'}}>
                                    <p className="item-title">Weapon 1</p>
                                </Segment>
                            </Rail>
                            <Rail position='right'>
                                <Segment className="ring">
                                    <p className="item-title">Ring 2</p>
                                </Segment>
                                <Segment className="weapon">
                                    <p className="item-title">Weapon 2</p>
                                </Segment>
                            </Rail>
                        </Segment>
                        <Segment className="pants">
                            <p className="item-title">Pants</p>
                            <Image src='' />
                        </Segment>
                        <Segment className="boots">
                            <p className="item-title">Boots</p>
                            <Image src='' />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

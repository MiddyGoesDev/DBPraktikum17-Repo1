import './GameChat.css';
import React from 'react';

import Game from './Game/Game';
import Chat from './Chat/Chat';
import {Card, Grid} from 'semantic-ui-react'

class GameChat extends React.Component {

  /**
  *Puts the game next to the chat
  */
    render() {
        return (
            <Grid centered style={{paddingTop: '20px', height: '90%'}}>
                <Card.Group style={{width: '90%'}}>
                    <Card className="ten wide column" style={{width: '70%', padding: 0}}>
                        <Game />
                    </Card>
                    <Card className="three wide column" style={{width: '20%'}}>
                        <Card.Content style={{height: '100%'}}>
                            <Chat />
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Grid>
        );
    }
}

export default GameChat

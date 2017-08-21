import './GameChat.css';
import React from 'react';

import Game from './Game/Game';
import Chat from './Chat/Chat';
import { Card } from 'semantic-ui-react'

class GameChat extends React.Component {

    render() {
        return (
            <div className="ui centered grid cards" style={{paddingTop: '20px', height: '90%'}}>
                <Card className="ten wide column" style={{padding: 0}}>
                    <Game />
                </Card>
                <Card className="three wide column">
                    <Card.Content style={{height: '100%'}}>
                        <Chat />
                    </Card.Content>
                </Card>
            </div>
        );
    }
}

export default GameChat

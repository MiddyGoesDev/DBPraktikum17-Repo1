import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div className="gameWindows">
                <canvas id="gameField" />

                <div id="Chat">
                    <p>Chat goes here</p>
                </div>
            </div>
        );
    }
}

export default Game

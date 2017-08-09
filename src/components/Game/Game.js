import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div id="wrapper">
                <div id="game">
                    <canvas id="gameField" />
                </div>

                <div id="chat">
                    <p>Chat goes here</p>
                </div>
            </div>
        );
    }
}

export default Game

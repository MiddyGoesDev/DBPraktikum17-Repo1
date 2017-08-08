import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div className="game">
                <canvas id="gameField" width="5000" height="5000"/>
            </div>
        );
    }
}

export default Game

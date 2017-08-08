import './Game.css';
import React from 'react';

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <canvas id="game-field" />
            </div>
        )
    }
}

export default Game
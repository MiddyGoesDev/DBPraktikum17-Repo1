import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div id="game-window" className="game-window">
                <canvas id="game-field" width={700} height={400} />
            </div>
            </div>
        );
    }
}

export default Game

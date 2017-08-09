import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div>
            <div className="gameWindow">
                <canvas id="gameField" width={700} height={400} />
            </div>
            </div>
        );
    }
}

export default Game

import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div className="gameWindow">
                <canvas id="gameField" width={700} height={400} />
            </div>
        );
    }
}

export default Game

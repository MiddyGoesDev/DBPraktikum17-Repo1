import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div className="gameWindows">
                <canvas id="gameField" width={400} height={400} />
            </div>
        );
    }
}

export default Game

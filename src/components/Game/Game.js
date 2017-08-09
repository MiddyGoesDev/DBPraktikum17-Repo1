import './Game.css';
import React from 'react';

class Game extends React.Component {

    render() {
        return (
            <div className="gameWindows">
                <canvas id="gameField" width={2000} height={2000} />
            </div>
        );
    }
}

export default Game

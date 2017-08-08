import './Game.css';
import React from 'react';

class Game extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="game">
                <canvas id="gameField" />
            </div>
        );
    }
}

export default Game
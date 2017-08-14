import './Game.css';

import React from 'react';
import ReactDOM from 'react-dom';

import getStage from './GameStage';

export default class Game extends React.Component {

    componentDidMount() {
        this.resizeGame();
        this.startGame();
    }

    resizeGame() {
        const gameField = ReactDOM.findDOMNode(this.refs.gameField);
        const gameWindow = ReactDOM.findDOMNode(this.refs.gameWindow);
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    startGame() {
        window.addEventListener('resize', this.resizeGame);

        getStage().initialize();

        document.onkeydown = getStage().keyPressed;
        document.onkeyup = getStage().keyReleased;
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.addEventListener("tick", () => { getStage().update(); });
    }

    render() {
        return (
            <div ref="gameWindow" id="game-window" className="game-window">
                <canvas ref="gameField" id="game-field" width={700} height={400} />
            </div>
        );
    }
}

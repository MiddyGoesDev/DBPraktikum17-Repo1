import './Game.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {join, leave, ownCharacter, linkOpponents, updateOpponents} from '../../actions/character';

import GameStage from './GameStage';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.resizeGame();
        this.props.actions.join();
        this.startGame();
    }

    resizeGame() {
        const gameField = ReactDOM.findDOMNode(this.refs.gameField);
        const gameWindow = ReactDOM.findDOMNode(this.refs.gameWindow);
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    componentWillUnmount() {
        this.props.actions.leave().then(character => {

        });
    }

    startGame() {
        window.addEventListener('resize', this.resizeGame);

        this.props.actions.ownCharacter().then(character => {
            GameStage().initialize(character.x, character.y);
            GameStage().activeObject.id = character.id;
            GameStage().networkObjects[character.id] = GameStage().activeObject;
        });

        this.props.actions.linkOpponents();
        this.props.actions.updateOpponents();

        document.onkeydown = GameStage().keyPressed;
        document.onkeyup = GameStage().keyReleased;
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.addEventListener("tick", () => { GameStage().update(); });
    }

    render() {
        return (
            <div ref="gameWindow" id="game-window" className="game-window">
                <canvas ref="gameField" id="game-field" width={700} height={400} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({join, leave, ownCharacter, linkOpponents, updateOpponents}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
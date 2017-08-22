import './Game.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {join, leave, ownCharacter, updateOpponents, updateCharacter, setTimer} from '../../actions/character';

import GameStage from './GameStage';
import {clearStage} from "./GameStage"

import {KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT} from './Constants/KeyCodes';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            joinDate: new Date(),
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
        this.props.actions.leave();
        this.props.actions.setTimer(this.state.joinDate);
        this.endGame();
    }

    startGame() {
        this.props.actions.ownCharacter().then(character => {
            GameStage().initialize(character.x, character.y);
            GameStage().activeObject.id = character.id;
            GameStage().activeObject.character = character;
            GameStage().activeObject.animation = 'idle';
            GameStage().networkObjects[character.id] = GameStage().activeObject;
        });

        this.addListeners();
    }


    handleKeyDown(e) {
        // prevent scrolling while playing
        if ([KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            GameStage().keyPressed(e);
        }
    }

    handleKeyUp(e) {
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            GameStage().keyReleased(e);
        }
    }

    addListeners() {
        window.addEventListener('resize', this.resizeGame);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.setFPS(GameStage().fps);
        window.createjs.Ticker.addEventListener('tick', this.handleTick);
    }

    removeListeners() {
        window.removeEventListener('resize', this.resizeGame);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.removeEventListener('tick', this.handleTick);
    }

    endGame() {
        this.removeListeners();
        clearStage();
    }

    handleTick(event) {
        GameStage().update(event);
        if (GameStage().activeObject.keyChanged) {
            GameStage().activeObject.handleEvent();
            GameStage().activeObject.keyChanged = false;
        }
    }


    stopChatting() {
        document.getElementById('chat-input').blur();
    }

    render() {
        return (
            <div ref="gameWindow" id="game-window" className="game-window" onClick={this.stopChatting}>
                <canvas ref="gameField" id="game-field" width={700} height={400}/>
            </div>
        );
    }
}



function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({join, leave, ownCharacter, updateOpponents, updateCharacter, setTimer}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

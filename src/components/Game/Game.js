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

    componentWillMount() {
        this.props.actions.join();
    }

    componentDidMount() {
        this.setState({width: this.refs.gameWindow.clientWidth, height: this.refs.gameWindow.clientHeight});
        this.startGame();
    }

    componentWillUnmount() {
        this.props.actions.leave();
        this.props.actions.setTimer(this.state.joinDate);
        this.closeGame();
    }

    resizeGame() {
        console.log('resize window');
        let gameWindow = document.getElementById('game-window');
        let gameField = document.getElementById('game-field');
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    startGame() {
        this.props.actions.ownCharacter().then(character => {
            GameStage().initialize(character.x, character.y);
            GameStage().activeObject.id = character.id;
            GameStage().activeObject.character = character;
            GameStage().activeObject.animation = 'idle';
            GameStage().networkObjects[character.id] = GameStage().activeObject;
        });

        this.props.actions.updateOpponents();

        this.addListeners();
    }

    closeGame() {
        this.removeListeners();
        clearStage();
    }

    addListeners() {
        window.addEventListener('resize', this.resizeGame);
        document.addEventListener('keydown', Game.handleKeyDown);
        document.addEventListener('keyup', Game.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.setFPS(GameStage().fps);
        window.createjs.Ticker.addEventListener('tick', Game.handleTick);
    }

    removeListeners() {
        window.removeEventListener('resize', this.resizeGame);
        document.removeEventListener('keydown', Game.handleKeyDown);
        document.removeEventListener('keyup', Game.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.removeEventListener('tick', Game.handleTick);
    }

    static handleKeyDown(e) {
        // prevent scrolling while playing
        if ([KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            GameStage().keyPressed(e);
        }
    }

    static handleKeyUp(e) {
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            GameStage().keyReleased(e);
        }
    }

    static handleTick(event) {
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
                <canvas ref="gameField" id="game-field" width={this.state.width} height={this.state.height}/>
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

import './Game.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {me} from '../../actions/auth';
import {join, leave, findOpponents, getCharacter, ownCharacter} from '../../actions/connection';

import getStage from './GameStage';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.resizeGame();
        this.props.actions.join();
        this.props.actions.findOpponents();
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
    }

    startGame() {
        window.addEventListener('resize', this.resizeGame);

        let ownCharacter = this.props.actions.ownCharacter();
        console.log('own Character:');
        ownCharacter.then((result) => {
            console.log('abaa');
            console.log(result)
        });
        console.log();
/*
 .then(character => {
 console.log('get Character:');
 console.log(character);
 getStage().initialize(character.x, character.y)
 })
 */
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

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({join, leave, findOpponents, getCharacter, ownCharacter, me}, dispatch)} //clearChat
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
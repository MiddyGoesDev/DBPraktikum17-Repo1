import './Game.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {join, leave, ownCharacter, updateOpponents, updateCharacter, setTimer} from '../../actions/character';

import GameStage from './GameStage';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          joinDate: null,
          leaveDate: null,
          playedTime: null
        }
    }

    componentDidMount() {
        this.resizeGame();
        this.props.actions.join();
        this.startGame();
        this.setState({
          joinDate: new Date()
        })
    }

    resizeGame() {
        const gameField = ReactDOM.findDOMNode(this.refs.gameField);
        const gameWindow = ReactDOM.findDOMNode(this.refs.gameWindow);
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    componentWillUnmount() {
        this.props.actions.leave();
        this.setState({
          leaveDate: new Date(),
          playedTime: this.state.leaveDate - this.state.joinDate
        }).then((result) =>{
          this.actions.setTimer(this.state.playedTime)
        })
    }

    startGame() {
        window.addEventListener('resize', this.resizeGame);

        this.props.actions.ownCharacter().then(character => {
            GameStage().initialize(character.x, character.y);
            GameStage().activeObject.id = character.id;
            GameStage().activeObject.character = character;
            GameStage().networkObjects[character.id] = GameStage().activeObject;
        });

        this.props.actions.updateOpponents();

        document.onkeydown = GameStage().keyPressed;
        document.onkeyup = GameStage().keyReleased;

        // TODO prevent scrolling
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.addEventListener('tick', () => {
            GameStage().update();
            if(GameStage().activeObject.keyChanged) {
                GameStage().activeObject.handleEvent();
                GameStage().activeObject.keyChanged = false;
            }
        });
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
    return {actions: bindActionCreators({join, leave, ownCharacter, updateOpponents, updateCharacter, setTimer}, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

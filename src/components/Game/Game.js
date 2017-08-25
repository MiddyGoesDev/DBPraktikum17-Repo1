import './Game.css';

import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {join, leave, character, updateOpponents, updateCharacter, setTimer} from '../../actions/character';
import {equipment, inventory} from '../../actions/profile';

import GameStage from './GameStage';
import {KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT, KEYCODE_UP} from "./Constants/KeyCodes";
import generateItem from './Items/ItemFactory';
import Key from "./Items/Key";

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
        console.log(this.refs);
        this.setState({width: this.refs.gameWindow.clientWidth, height: this.refs.gameWindow.clientHeight});
        this.startGame();
    }

    componentWillUnmount() {
        this.props.actions.leave();
        this.props.actions.setTimer(this.state.joinDate);
        Game.closeGame();
    }

    startGame() {
        this.props.actions.character().then(character =>
            this.props.actions.equipment().then(equipment =>
                this.props.actions.inventory().then(inventory => {
                    GameStage().initialize(character.x, character.y);
                    let player = GameStage().activeObject;
                    player.id = character.id;
                    player.character = character;
                    player.animation = 'idle';
                    GameStage().link(player);
                    player.emit('join');

                    if (equipment.main_hand !== null) {
                        GameStage().activeObject.weapon = generateItem(equipment.main_hand.name, 0, 0);
                    }
                    inventory.forEach(inventoryItem => {
                        switch (inventoryItem.item.name) {
                            case 'Key':
                                let key = new Key(0, 0);
                                key.id = inventoryItem.item.id;
                                GameStage().activeObject.items.push(key);
                        }
                    });

                    this.props.actions.updateOpponents();

                    Game.addListeners();
                })));
    }

    static closeGame() {
        Game.removeListeners();
        GameStage().clear();
    }

    static resizeGame() {
        let gameWindow = document.getElementById('game-window');
        let gameField = document.getElementById('game-field');
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    static addListeners() {
        window.addEventListener('resize', Game.resizeGame);
        document.addEventListener('keydown', Game.handleKeyDown);
        document.addEventListener('keyup', Game.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.setFPS(GameStage().fps);
        window.createjs.Ticker.addEventListener('tick', Game.handleTick);
    }

    static removeListeners() {
        window.removeEventListener('resize', Game.resizeGame);
        document.removeEventListener('keydown', Game.handleKeyDown);
        document.removeEventListener('keyup', Game.handleKeyUp);
        window.createjs.Ticker.removeEventListener('tick', Game.handleTick);
    }

    static handleKeyDown(e) {
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            if ([KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
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

    static stopChatting() {
        document.getElementById('chat-input').blur();
    }

    render() {
        return (
            <div ref="gameWindow" id="game-window" className="game-window" onClick={Game.stopChatting}>
                <canvas ref="gameField" id="game-field" width={this.state.width} height={this.state.height}/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            join,
            leave,
            character,
            updateOpponents,
            updateCharacter,
            setTimer,
            equipment,
            inventory
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

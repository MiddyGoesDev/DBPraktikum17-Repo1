import './Game.css';

import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {join, leave, ownCharacter, updateOpponents, updateCharacter, setTimer} from '../../actions/character';
import {equipment, inventory} from '../../actions/profile';

import GameStage from './GameStage';
import {KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT, KEYCODE_UP} from "./Constants/KeyCodes";
import Manji from "./Items/Manji";
import YagyuRyuYayuji from "./Items/YagyuRyuYayuji";
import KoboriRyuHorenGata from "./Items/KoboriRyuHorenGata";
import IgaRyuHappo from "./Items/IgaRyuHappo";
import GurandoMasutaa from "./Items/GurandoMasutaa";
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
        this.setState({width: this.refs.gameWindow.clientWidth, height: this.refs.gameWindow.clientHeight});
        this.startGame();
    }

    componentWillUnmount() {
        this.props.actions.leave();
        this.props.actions.setTimer(this.state.joinDate);
        Game.closeGame();
    }

    startGame() {
        this.props.actions.ownCharacter().then(character => {
            GameStage().initialize(character.x, character.y);
            GameStage().activeObject.id = character.id;
            GameStage().activeObject.character = character;
            GameStage().activeObject.animation = 'idle';
            GameStage().activeObject.emit('join');
            GameStage().networkObjects[character.id] = GameStage().activeObject;

            this.props.actions.equipment().then(equipment => {
                this.props.actions.inventory().then(inventory => {
                    if (equipment.main_hand !== null) {
                        switch (equipment.main_hand.name) {
                            case 'Manji': GameStage().activeObject.weapon = new Manji(0, 0); break;
                            case 'Yagyu Ryu Yayuji': GameStage().activeObject.weapon = new YagyuRyuYayuji(0, 0); break;
                            case 'Kobori Ryu Horen Gata': GameStage().activeObject.weapon = new KoboriRyuHorenGata(0, 0); break;
                            case 'Iga Ryu Happo': GameStage().activeObject.weapon = new IgaRyuHappo(0, 0); break;
                            case 'Gurando Masutaa': GameStage().activeObject.weapon = new GurandoMasutaa(0, 0); break;
                        }
                    }
                    inventory.forEach(inventoryItem => {
                        switch (inventoryItem.item.name) {
                            case 'Key':
                                let key = new Key(0, 0);
                                key.id = inventoryItem.item.id;
                                GameStage().activeObject.items.push(key);
                        }
                    })
                });
            });

            this.props.actions.updateOpponents();

            Game.addListeners();
        });
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
        // Actions carried out each tick (aka frame)
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
            ownCharacter,
            updateOpponents,
            updateCharacter,
            setTimer,
            equipment,
            inventory
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

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
import {Dimmer, Header, Icon, Button} from "semantic-ui-react";

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            joinDate: new Date(),
        }
    }

    /**
     * Joins the game. Sets the Character to playing: true in the DB.
     */
    componentWillMount() {
        this.props.actions.join();
    }

    /**
     * Determines clientsize and initializes the game accordingly.
     */
    componentDidMount() {
        this.setState({width: this.refs.gameWindow.clientWidth, height: this.refs.gameWindow.clientHeight});
        this.startGame();
    }

    /**
     * Set Character.playing to false. Update total playing time. Close the game.
     */
    componentWillUnmount() {
        this.props.actions.leave();
        this.props.actions.setTimer(this.state.joinDate);
        Game.closeGame();
    }

    /**
     * Initializes the game.
     */
    startGame() {
        this.props.actions.character().then(character => // if the user is logged in, he has a character
            this.props.actions.equipment().then(equipment => // and an equipment
                this.props.actions.inventory().then(inventory => { // and an inventory
                    // Start the game, using the User's character
                    GameStage().initialize(character.x, character.y);
                    let player = GameStage().activeObject;
                    player.id = character.id;
                    player.character = character;
                    player.animation = 'idle';

                    // alert socket about the new player
                    GameStage().link(player);
                    player.emit('join');

                    // initialize equipment and inventory
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

                    // initialize opponents
                    this.props.actions.updateOpponents();

                    Game.addListeners();
                })));
    }

    /**
     *     removes all listeners and cleans up the canvas
     */
    static closeGame() {
        Game.removeListeners();
        GameStage().clear();
    }

    /**
     * Call when the client size is changed.
     */
    static resizeGame() {
        let gameWindow = document.getElementById('game-window');
        let gameField = document.getElementById('game-field');
        gameField.width = gameWindow.clientWidth;
        gameField.height = gameWindow.clientHeight;
    }

    /**
     * Adds keylisteners and the ticker for canvas updates to the game.
     */
    static addListeners() {
        window.addEventListener('resize', Game.resizeGame);
        document.addEventListener('keydown', Game.handleKeyDown);
        document.addEventListener('keyup', Game.handleKeyUp);
        // Actions carried out each tick (aka frame)
        window.createjs.Ticker.setFPS(GameStage().fps);
        window.createjs.Ticker.addEventListener('tick', Game.handleTick);
    }

    /**
     * Removes all listeners.
     */
    static removeListeners() {
        window.removeEventListener('resize', Game.resizeGame);
        document.removeEventListener('keydown', Game.handleKeyDown);
        document.removeEventListener('keyup', Game.handleKeyUp);
        window.createjs.Ticker.removeEventListener('tick', Game.handleTick);
    }

    static handleKeyDown(e) {
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            //and if key pressed is up down left right
            if ([KEYCODE_UP, KEYCODE_DOWN, KEYCODE_LEFT, KEYCODE_RIGHT].indexOf(e.keyCode) > -1) {
                e.preventDefault(); // do not scroll
            }
            // but perform an action ingame
            GameStage().keyPressed(e);
        }
    }

    static handleKeyUp(e) {
        // if userIsntChatting
        if (document.activeElement.id !== 'chat-input') {
            // perform an action ingame
            GameStage().keyReleased(e);
        }
    }

    /**
     * Actions that need to be performed every tick.
     * @param event Passed down to update FPS properly (Tween.js).
     */
    static handleTick(event) {
        GameStage().update(event); // updates the stage and all its objects
        if (GameStage().activeObject.keyChanged) { // if a key was pressed
            GameStage().activeObject.handleEvent(); // activeObject handles the event
            GameStage().activeObject.keyChanged = false; // and takes note of it
        }
    }

    /**
     * Call when focus needs to be removed from the chat input, aka the user is playing.
     */
    static stopChatting() {
        document.getElementById('chat-input').blur();
    }

    render() {
        return (
            <div ref="gameWindow" id="game-window" className="game-window" onClick={Game.stopChatting}>
                <canvas ref="gameField" id="game-field" width={this.state.width} height={this.state.height}/>
                <Dimmer id="game-dimmer" active={false} page>
                    <Header as='h2' icon inverted>
                        <Icon name='time' />
                        Timed out!
                        <Header.Subheader>
                            Please refresh your page and check connection with the Socket.io game-server
                        </Header.Subheader>
                        <br/>
                        <Button primary onClick={() => location.reload()}>refresh</Button>
                    </Header>
                </Dimmer>
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

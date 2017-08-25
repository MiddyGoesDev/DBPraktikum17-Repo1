import PlayerGuy from './Characters/PlayerGuy';
import Cow from './Characters/Cow';
import Text from './Text';

import { db } from 'baqend/realtime';
import io from 'socket.io-client';
import Cottage from './Cottage';
import Gate from './Gate';
import Dragon from './Characters/Dragon';
import generateItem from './Items/ItemFactory';

let gameStage = null;

/**
 * Manages objects on the canvas and establishes the connection to Socket.io
 */

function GameStage() {

    /**
     * Create the stage and place both map and collision map on it.
     */
    this.construct = () => {
        // the stage from createjs that makes working with the canvas easy
        this.stage = new window.createjs.Stage('game-field');

        this.add({
            type: 'CollisionMap',
            update: () => {},
            sprite: new window.createjs.Sprite(new window.createjs.SpriteSheet({
                images: ['./assets/world-collision.png'],
                frames: {width: 2400, height: 5280, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
            }))
        });
        this.draw(new window.createjs.Sprite(new window.createjs.SpriteSheet({
            images: ['./assets/world.png'],
            frames: {width: 2400, height: 5280, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
        })));
    };

    /**
     * Create all basic objects and places the player at the given location.
     * @param x The x position to place the player at
     * @param y The y position to place the player at
     */
    this.initialize = (x, y) => {
        this.construct();
        this.activeObject = new PlayerGuy(x, y);
        var cowZone = new window.createjs.Shape();
        cowZone.graphics.s("gray").f("transparent").drawRect(800, 3300, 1100, 700);
        this.draw(cowZone);
        new Cottage(400, 220);
        generateItem('Key').drop(653, 1263);
    };

    /**
     * Use to remove all object from the stage.
     */
    this.clear = () => {
        gameStage = null;
    };

    /**
     * Call this function every tick to update the stage.
     * @param event Passed down to enable own FPS settings.
     */
    this.update = (event) => {
        // update all objects on the stage
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.centerCamera();
        // redraw the stage
        this.stage.update(event);
    };

    /**
     *  Focus the camera on the active object.
     */
    this.centerCamera = () => {
        this.stage.x = - this.activeObject.x + this.stage.canvas.clientWidth / 2;
        this.stage.y = - this.activeObject.y + this.stage.canvas.clientHeight / 2;
    };

    /**
     * Add the given object to the game.
     * @param object
     */
    this.add = (object) => {
        this.gameObjects.push(object);
        this.draw(object.sprite);
    };

    /**
     * Remove the object from the game.
     * @param object
     */
    this.remove = (object) => {
        this.erase(object.sprite);
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.id !== object.id);
    };

    /**
     * Draw a create.js sprite or shape to the canvas.
     * @param visualRepresentation
     */
    this.draw = (visualRepresentation) => {
        if (!this.hasChild(visualRepresentation)) {
            this.stage.addChild(visualRepresentation);
        }
    };

    /**
     * Erase a create.js sprite or shape from the canvas.
     * @param visualRepresentation
     */
    this.erase = (visualRepresentation) => {
        if (this.hasChild(visualRepresentation)) {
            this.stage.removeChild(visualRepresentation);
        }
    };

    /**
     * Start a countdown in the top left corner.
     * @param time The time in seconds to be counted down from.
     */
    this.startCountdown = (time) => {
        this.erase(this.text);
        let x = this.activeObject.x - this.stage.canvas.clientWidth / 2 + 7;
        let y = this.activeObject.y - this.stage.canvas.clientHeight / 2 + 3;
        this.text = new Text(time, x, y, 30, 'Arial' ,'#fff');
        this.draw(this.text);
        if(time > 0) {
            setTimeout(this.startCountdown, 1000, time - 1);
        }
        else {
            setTimeout(this.erase, 500, this.text);
        }
    };

    /**
     * Checks whether the object is painted on the stage.
     * @param visualRepresentation
     * @returns {boolean}
     */
    this.hasChild = (visualRepresentation) => {
        return this.stage.getChildIndex(visualRepresentation) !== -1;
    };

    /**
     * Adds the object to the networkObjects.
     * @param object
     */
    this.link = (object) => {
        this.networkObjects[object.id] = object;
    };


    /**
     * Removes the object from the networkObjects and removes it from the map.
     * @param object
     */
    this.unlink = (id) => {
        this.networkObjects[id].destruct();
        this.remove(this.networkObjects[id]);
        delete this.networkObjects[id];
    };

    this.isConnected = (id) => {
        return this.networkObjects.hasOwnProperty(id);
    };

    /**
     * Return all objects close to a given object.
     * @param object
     * @returns {Array.<T>}
     */
    this.near = (object) => {
        // TODO: implement near, currently all objects
        return this.gameObjects.filter(gameObject => gameObject.id !== object.id);
    };

    this.getNetworkObject = (index) => this.networkObjects[Object.keys(this.networkObjects)[index]];

    /**
     * Handle a keypress by adding it to the active keys.
     * @param event The keyEvent triggered by the key that was pressed.
     */
    this.keyPressed = (event) => {
        if (this.activeKeys.indexOf(event.keyCode) === -1) {
            this.activeKeys.push(event.keyCode);
            this.activeObject.keyChanged = true;
        }
    };

    /**
     * Handle a keyrelease by removing it from the active keys.
     * @param event The keyEvent triggered by the key that was released
     */
    this.keyReleased = (event) => {
        this.activeKeys = this.activeKeys.filter(keyCode => keyCode !== event.keyCode);
        this.activeObject.keyChanged = true;
    };

    this.stage = null;
    // all objects on the stage
    this.gameObjects = [];
    // the object focused by the camera
    this.activeObject = null;
    // relevant objects for socket.io
    this.networkObjects = { };
    // currently pressed keys
    this.activeKeys = [];
    // the baqend db
    this.db = db;
    // the fps the game is played at. increase or decrease at own risk
    this.fps = 40;

    // this.socket = io('http://localhost:8080');
    this.socket = io('207.154.243.43:8080');

    /**
     * updates the state of an object
     */
    this.socket.on('update', object => {
        switch (object.type) {
            case 'Player':
            case 'Character':
                let character = this.networkObjects[object.id];
                character.updatePosition(object.x, object.y);
                character.nextDirection = object.direction;
                character.nextAnimation = object.animation;
                character.currentHP = object.currentHP;
                if (character.isDead()) {
                    character.destruct();
                    character.respawn(5000);
                }
                break;
            case 'Cow':
                let cow = this.networkObjects[object.id];
                cow.destX = object.x;
                cow.destY = object.y;
                cow.currentHP = object.currentHP;
                break;
        }
    });

    /**
     * spawn an object serverside
     */
    this.socket.on('spawn', monster => {
        switch (monster.type) {
            case 'Cow':
                let cow = new Cow(monster.x, monster.y);
                cow.id = monster.id;
                cow.direction = monster.direction;
                cow.currentHP = monster.currentHP;
                cow.play(monster.animation);
                this.networkObjects[cow.id] = cow;
                break;
            case 'Dragon':
                let dragon = new Dragon(monster.x, monster.y);
                dragon.id = monster.id;
                dragon.direction = monster.direction;
                dragon.currentHP = monster.currentHP;
                dragon.play(monster.animation);
                this.networkObjects[dragon.id] = dragon;
                break;
            case 'Gate':
                let gate = new Gate(monster.x, monster.y);
                gate.id = monster.id;
        }
    });

    /**
     * spawn fists of an opponent player
     */
    this.socket.on('spawn fist', player => {
        let character = this.networkObjects[player.id];
        character.nextAnimation = player.animation;
        character.punch();
    });

    /**
     * spawn a weapon of an opponent player
     */
    this.socket.on('spawn weapon', player => {
        this.networkObjects[player.id].use();
    });

    /**
     * generate the loot and set the stats
     */
    this.socket.on('drop loot', loot => {
        let item = generateItem(loot.item.name);
        item.vitality = loot.item.vitality;
        item.strength = loot.item.strength;
        item.dexterity = loot.item.dexterity;
        item.intelligence = loot.item.intelligence;
        item.drop(loot.x, loot.y);
    });

    /**
     * open the gate if someone opens it
     */
    this.socket.on('gate opened', gate => {
        this.gameObjects[gate.id].destruct();
    });
}

/**
 * get a singleton object of the GameStage
 * @returns {*}
 */
export default function getStage() {
    if (gameStage === null) {
        gameStage = new GameStage();
    }
    return gameStage;
}
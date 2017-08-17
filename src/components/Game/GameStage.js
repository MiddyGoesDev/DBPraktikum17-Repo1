import PlayerGuy from './PlayerGuy';
import Wall from './Wall';
import Cow from './Cow';

import { db } from 'baqend/realtime';
import io from 'socket.io-client';

let gameStage = null;

function GameStage() {

    this.construct = () => {
        this.stage = new window.createjs.Stage('game-field');
    };

    this.initialize = (x, y) => {
        this.activeObject = new PlayerGuy(x, y);
        new Wall(80, 40);
    };

    this.update = () => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.stage.update();
    };

    this.add = (object) => {
        this.gameObjects.push(object);
        this.stage.addChild(object.sprite);
    };

    this.remove = (object) => {
        this.stage.removeChild(object.sprite);
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.id !== object.id);
        // TODO: think about
        // delete this.networkObjects[this.id];
        // delete this;
    };

    this.link = (object) => {
        this.networkObjects[object.id] = object;
    };

    this.unlink = (id) => {
        this.remove(this.networkObjects[id]);
        delete this.networkObjects[id];
    };

    this.on = (action) => {
        this.networkObjects.forEach(object => object.on(action));
    };

    this.near = (object) => {
        // TODO: implement near
        return this.gameObjects.filter((gameObject) => { return gameObject.id !== object.id });
    };

    this.keyPressed = (event) => {
        if (this.activeKeys.lastIndexOf(event.keyCode) === -1) {
            this.activeKeys.push(event.keyCode);
        }
        this.activeObject.keyChanged = true;
    };

    this.keyReleased = (event) => {
        this.activeKeys = this.activeKeys.filter((keyCode) => {
            return keyCode !== event.keyCode;
        });
        this.activeObject.keyChanged = true;
    };

    this.stage = null;
    this.gameObjects = [];
    this.activeObject = null;
    this.networkObjects = { };
    this.activeKeys = [];
    this.db = db;
    // this.socket = io('http://localhost:8080');
    this.socket = io('207.154.243.43:8080');
    this.construct();

    this.socket.on('update', object => {
        switch (object.type) {
            case 'Character':
                this.networkObjects[object.id].updatePosition(object.x, object.y);
                this.networkObjects[object.id].nextDirection = object.direction;
                this.networkObjects[object.id].nextAnimation = object.animation;
                break;
            case 'Cow':
                this.networkObjects[object.id].updatePosition(object.x, object.y);
                this.networkObjects[object.id].direction = object.direction;
                this.networkObjects[object.id].play(object.animation);
                break;
        }
    });

    this.socket.on('spawn', mob => {
        switch (mob.type) {
            case 'Cow':
                let cow = new Cow(mob.x, mob.y);
                cow.id = mob.id;
                cow.direction = mob.direction;
                cow.play(mob.animation);
                this.networkObjects[cow.id] = cow;
                break;
        }
    });
}

export default function getStage() {
    if (gameStage === null) {
        gameStage = new GameStage();
    }
    return gameStage;
}
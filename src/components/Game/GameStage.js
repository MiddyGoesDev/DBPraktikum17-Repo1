import PlayerGuy from './Characters/PlayerGuy';
import Wall from './Wall';
import Cow from './Characters/Cow';

import { db } from 'baqend/realtime';
import io from 'socket.io-client';
import Cottage from "./Cottage";
import Fist from "./Projectiles/Fist";

let gameStage = null;

function GameStage() {

    this.construct = () => {
        this.stage = new window.createjs.Stage('game-field');
    };

    this.initialize = (x, y) => {
        this.activeObject = new PlayerGuy(x, y);
        new Wall(80, 40);
        var cowZone = new window.createjs.Shape();
        cowZone.graphics.s("gray").f("transparent").drawRect(150, 150, 200, 200);
        new Cottage(400, 220);
        this.stage.addChild(cowZone);
    };

    this.update = () => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.stage.update();
    };

    this.add = (object) => {
        this.gameObjects.push(object);
        this.draw(object.sprite);
    };

    this.remove = (object) => {
        this.stage.removeChild(object.sprite);
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.id !== object.id);
    };

    this.draw = (visualRepresentation) => {
        if (!this.hasChild(visualRepresentation)) {
            this.stage.addChild(visualRepresentation);
        }
    };

    this.erase = (visualRepresentation) => {
        if (this.hasChild(visualRepresentation)) {
            this.stage.removeChild(visualRepresentation);
        }
    };

    this.hasChild = (visualRepresentation) => {
        return this.stage.getChildIndex(visualRepresentation) !== -1;
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
        return this.gameObjects.filter(gameObject => gameObject.id !== object.id );
    };

    this.keyPressed = (event) => {
        if (this.activeKeys.indexOf(event.keyCode) === -1) {
            this.activeKeys.push(event.keyCode);
        }
        this.activeObject.keyChanged = true;
    };

    this.keyReleased = (event) => {
        this.activeKeys = this.activeKeys.filter(keyCode => keyCode !== event.keyCode);
        this.activeObject.keyChanged = true;
    };

    this.stage = null;
    this.gameObjects = [];
    this.activeObject = null;
    this.networkObjects = { };
    this.activeKeys = [];
    this.db = db;
    this.socket = io('http://localhost:8080');
    // this.socket = io('207.154.243.43:8080');
    this.construct();

    this.socket.on('update', object => {
        switch (object.type) {
            case 'Character':
                this.networkObjects[object.id].updatePosition(object.x, object.y);
                this.networkObjects[object.id].nextDirection = object.direction;
                this.networkObjects[object.id].nextAnimation = object.animation;
                break;
            case 'Cow':
                this.networkObjects[object.id].destX = object.x;
                this.networkObjects[object.id].destY = object.y;
                this.networkObjects[object.id].destDirection = object.direction;
                this.networkObjects[object.id].hp = object.hp;
                break;
        }
    });

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
        }
    });

    this.socket.on('spawn fist', player => {
        console.log('spawn fist');
        console.log(this.networkObjects[player.id]);
        this.networkObjects[player.id].punch();
    });
}

export default function getStage() {
    if (gameStage === null) {
        gameStage = new GameStage();
    }
    return gameStage;
}
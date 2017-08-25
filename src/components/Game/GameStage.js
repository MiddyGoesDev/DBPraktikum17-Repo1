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

function GameStage() {

    this.construct = () => {
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

    this.initialize = (x, y) => {
        this.construct();
        this.activeObject = new PlayerGuy(x, y);
        var cowZone = new window.createjs.Shape();
        cowZone.graphics.s("gray").f("transparent").drawRect(800, 3300, 1100, 700);
        this.draw(cowZone);
        new Cottage(400, 220);
        generateItem('Key').drop(653, 1263);
    };

    this.clear = () => {
        gameStage = null;
    };

    this.update = (event) => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.centerCamera();
        this.stage.update(event);
    };

    this.centerCamera = () => {
        this.stage.x = - this.activeObject.x + this.stage.canvas.clientWidth / 2;
        this.stage.y = - this.activeObject.y + this.stage.canvas.clientHeight / 2;
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
        this.networkObjects[id].destruct();
        this.remove(this.networkObjects[id]);
        delete this.networkObjects[id];
    };

    this.isConnected = (id) => {
        return this.networkObjects.hasOwnProperty(id);
    };

    this.near = (object) => {
        // TODO: implement near
        return this.gameObjects.filter(gameObject => gameObject.id !== object.id);
    };

    this.getNetworkObject = (index) => this.networkObjects[Object.keys(this.networkObjects)[index]];

    this.keyPressed = (event) => {
        if (this.activeKeys.indexOf(event.keyCode) === -1) {
            this.activeKeys.push(event.keyCode);
            this.activeObject.keyChanged = true;
        }
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
    this.fps = 40;
    this.socket = io('http://localhost:8080');
    // this.socket = io('207.154.243.43:8080');

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

    this.socket.on('spawn', monster => {
        console.log('spawn', monster.type);
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

    this.socket.on('spawn fist', player => {
        let character = this.networkObjects[player.id];
        character.nextAnimation = player.animation;
        character.punch();
    });

    this.socket.on('spawn weapon', player => {
        this.networkObjects[player.id].use();
    });


    this.socket.on('drop loot', loot => {
        let item = generateItem(loot.item.name);
        item.vitality = loot.item.vitality;
        item.strength = loot.item.strength;
        item.dexterity = loot.item.dexterity;
        item.intelligence = loot.item.intelligence;
        item.drop(loot.x, loot.y);
    });

    this.socket.on('gate opened', gate => {
        this.gameObjects[gate.id].destruct();
    });
}

export default function getStage() {
    if (gameStage === null) {
        gameStage = new GameStage();
    }
    return gameStage;
}
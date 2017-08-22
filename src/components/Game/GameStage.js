import PlayerGuy from './Characters/PlayerGuy';
import Wall from './Wall';
import Cow from './Characters/Cow';

import { db } from 'baqend/realtime';
import io from 'socket.io-client';
import Cottage from "./Cottage";
import Manji from "./Items/Manji";
import GurandoMasutaa from "./Items/GurandoMasutaa";
import KoboriRyuHorenGata from "./Items/KoboriRyuHorenGata";
import YagyuRyuYayuji from "./Items/YagyuRyuYayuji";
import IgaRyuHappo from "./Items/IgaRyuHappo";

let gameStage = null;

function GameStage() {

    this.construct = () => {
        this.stage = new window.createjs.Stage('game-field');
    };

    this.initialize = (x, y) => {
        this.construct();
        this.activeObject = new PlayerGuy(x, y);
        new Wall(80, 40);
        var cowContainer = new window.createjs.Container();
        var cowZone = new window.createjs.Shape();
        cowZone.graphics.s("gray").f("transparent").drawRect(150, 150, 200, 200);
        new Cottage(400, 220);
        this.stage.addChild(cowZone);
    };

    this.update = (event) => {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update();
        });
        this.moveCanvasAlong();
        this.stage.update(event);
    };

    this.moveCanvasAlong = () => {
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
    this.fps = 40;
    // this.socket = io('http://localhost:8080');
    this.socket = io('207.154.243.43:8080');

    this.socket.on('update', object => {
        switch (object.type) {
            case 'Player':
            case 'Character':
                this.networkObjects[object.id].updatePosition(object.x, object.y);
                this.networkObjects[object.id].nextDirection = object.direction;
                this.networkObjects[object.id].nextAnimation = object.animation;
                break;
            case 'Cow':
                this.networkObjects[object.id].destX = object.x;
                this.networkObjects[object.id].destY = object.y;
                this.networkObjects[object.id].currentHP = object.currentHP;
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
        this.networkObjects[player.id].punch();
    });

    this.socket.on('drop loot', loot => {
        var item = null;
        switch (loot.item.name) {
            case 'Manji': item = new Manji(loot.x, loot.y); break;
            case 'Yagyu Ryu Yayuji': item = new YagyuRyuYayuji(loot.x, loot.y); break;
            case 'Kobori Ryu Horen Gata': item = new KoboriRyuHorenGata(loot.x, loot.y); break;
            case 'Iga Ryu Happo': item = new IgaRyuHappo(loot.x, loot.y); break;
            case 'Gurando Masutaa': item = new GurandoMasutaa(loot.x, loot.y); break;
        }
        item.vitality = loot.item.vitality;
        item.strength = loot.item.strength;
        item.dexterity = loot.item.dexterity;
        item.intelligence = loot.item.intelligence;
    });
}

export default function getStage() {
    if (gameStage === null) {
        gameStage = new GameStage();
    }
    return gameStage;
}

//TODO macht es sinn das zu exportieren? oder sollte es ne normale funktion sein
export function clearStage() {
    gameStage = null;
}
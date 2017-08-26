# Black Water
Unsere Empfehlung ist es, das Spiel in *Firefox* laufen zu lassen.
*Chrome* und *Opera* funktionieren auch. *Safari* zeigt das Spielfeld nicht vollständig an.

## Steuerung

| Taste           | Aktion                 |
| ---------------:|:---------------------- |
| **Pfeiltasten** | Bewegung               |
| **S**           | Abfeuern der Faust     |
| **1**           | Werfen von Wurfsternen |
| **K**           | Selbstmord             |

##### Tips zum Spiel: 
Den Schlüssel findet man, wenn man dem Weg nach oben links folgt. 
Damit ist rechts das Tor zu öffnen, hinter welchem man etwas interessantes finden könnte.

## Known Bugs
- Collision funktioniert nicht immer einwandfrei, die Fäuste treffen teilweise nicht ihre Ziele.
- *Chrome* wirft manchmal Fehler, die ebenfalls Collision bedingt sind, und das Spiel quasi lahmlegen
- Firefox stürzt in seltenen Fällen ab.
- Beim wechseln von Komponenten wird manchmal der eigene Charakter nicht korrekt ausgewählt.

All diese Bugs lassen sich in der Regel durch **refreshen** der Seite beheben.

## Socket.io Guide:
Der Realtime-Austausch zwischen Spielern läuft über unseren eigenen Server mit Socket.io.
Inaktive Spieler werden hin und wieder zum refresh gezwungen.
Ist der Socket-Server nicht online, kann in GameStage.js this.socket auf http://localhost:8080 gesetzt werden 
(also die auskommentierte Zeile einkommentieren und die entsprechende andere Zeile einkommentieren).
Ist dies geschehen, so kann der Server durch ausführen von 

```Bash
node server/index.js
```

im Projektverzeichnis gestartet werden. 
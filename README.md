{\rtf1\ansi\ansicpg1252\cocoartf1504\cocoasubrtf830
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Unsere Empfehlung ist es, das Spiel in Firefox laufen zu lassen.\
Chrome und Opera funktionieren auch. Safari zeigt das Spielfeld nicht vollst\'e4ndig an.\
\
Steuerung:\
Pfeiltasten: Bewegung\
S: Abfeuern der Faust\
1: Werfen von Wurfsternen\
K: Selbstmord\
\
Known Bugs:\
- Collision funktioniert nicht immer einwandfrei, die F\'e4uste treffen teilweise nicht ihre Ziele.\
- Chrome wirft manchmal Fehler, die ebenfalls Collision bedingt sind, und das Spiel quasi lahmlegen\
- Firefox st\'fcrzt in seltenen F\'e4llen ab.\
- Beim wechseln von Komponenten wird manchmal der eigene Charakter nicht korrekt ausgew\'e4hlt.\
All diese Bugs lassen sich in der Regel durch refreshen der Seite beheben.\
\
Socket.io Guide:\
Der Realtime-Austausch zwischen Spielern l\'e4uft \'fcber unseren eigenen Server mit Socket.io.\
Inaktive Spieler werden hin und wieder zum refresh gezwungen.\
Ist der Socket-Server nicht online, kann in GameStage.js this.socket auf http:localhost:8080 gesetzt werden (also die auskommentierte Zeile einkommentieren und die entsprechende andere Zeile einkommentieren)}
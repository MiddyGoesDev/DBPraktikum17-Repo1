var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3001, function(){
    console.log('listening on *:3001');
});

var connected = [];

io.on('connection', function(socket) {

    socket.on('join', function (guy) {
        console.log('user ' + socket.id + ' has connected');
        connected[socket.id] = guy;

        console.log(connected);

        socket.broadcast.emit('guy joined', guy);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
        socket.broadcast.emit('guy disconnected', connected[socket.id]);
        delete connected[socket.id];
    });

    socket.on('move guy', function (guy) {
        console.log('Object has moved');

        socket.broadcast.emit('update guy', guy);
    });

});


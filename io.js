var game;

function onConnection(socket) {
    console.log("[onConnection] username=" + socket.username);

    socket.on('disconnect', function () {
        console.log("[onDisconnect] username=" + socket.username);

        socket.broadcast
            .to(socket.game)
            .emit('bye', {
                username: socket.username
            });
    });

    socket.on('enter', function (data) {
        console.log("[onEnter] username=" + socket.username);

        var id = data.id;
        var username = data.username;

        socket.game = id;
        socket.username = username;

        socket.join(socket.game);
        socket.broadcast
            .to(socket.game)
            .emit('hello', {
                username: socket.username
            });
    });

    socket.on('players', function () {
        console.log("[onPlayers] username=" + socket.username);

        game.in(socket.game)
            .clients(function (err, clients) {
                if (err) {
                    console.error("Failed to get all players.", err);
                    return;
                }

                var players = [];
                clients.forEach(function (client) {
                    var player = game.connected[client];
                    players.push({
                        username: player.username
                    });
                });
                socket.emit('players', {
                    players: players
                });
            });
    });
}

module.exports = function (server) {
    const io = require('socket.io')(server);

    game = io.of('/game');
    game.on('connection', onConnection);
};
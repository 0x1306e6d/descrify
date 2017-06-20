const Game = require('./app/models/game');

var game;
var lobby;

function onGame(socket) {
    socket.on('disconnect', function () {
        socket.leave(socket.game);
        socket.to(socket.game)
            .emit('bye', {
                username: socket.username
            });

        Game.findById(socket.game, function (err, game) {
                if (err) {
                    console.error("게임을 찾을 수 없습니다. id=" + socket.game, err);
                    return;
                }
                game.exit(socket.username, function (err, game) {
                    if (err) {
                        console.error("게임 퇴장을 실패하였습니다.", err);
                        return;
                    }

                    console.log("유저가 게임을 퇴장하였습니다. username=" + socket.username + ", game=" + socket.game);
                });
            }
        );
    });

    socket.on('enter', function (data) {
        var id = data.id;
        var username = data.username;

        socket.game = id;
        socket.username = username;

        socket.join(socket.game);
        socket.to(socket.game)
            .emit('hello', {
                username: socket.username
            });

        Game.findById(socket.game, function (err, game) {
                if (err) {
                    console.error("게임을 찾을 수 없습니다. id=" + socket.game, err);
                    return;
                }
                game.participate(socket.username, function (err, game) {
                    if (err) {
                        console.error("게임 참가를 실패하였습니다.", err);
                        return;
                    }

                    console.log("새 유저가 게임에 참가하였습니다. username=" + socket.username + ", game=" + socket.game);
                });
            }
        );
    });

    socket.on('players', function () {
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

function onLobby(socket) {
    console.log("[onLobby] socket=" + socket);

    socket.on('disconnect', function () {
        console.log("[onDisconnect] socket=" + socket);
    });

    socket.on('games', function () {
        Game.find(function (err, games) {
            if (err) {
                console.error("Failed to find all games.", err);
                return;
            }

            socket.emit('games', games);
        });
    });
}

module.exports = function (server) {
    var io = require('socket.io')(server);

    game = io.of('/game');
    game.on('connection', onGame);

    lobby = io.of('/lobby');
    lobby.on('connection', onLobby);

    Game.schema.statics.onSave = function (game) {
        lobby.emit('game-save', game);
    };
    Game.schema.statics.onRemove = function (game) {
        lobby.emit('game-remove', game);
    };

    return io;
};
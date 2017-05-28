var express = require('express');
var Game = require('../src/database/game');
var router = express.Router();

router.get('/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var id = req.params.id;

        Game.find(id, function (err, game) {
            if (err) {
                console.log("Failed to find a game. id: " + id);
                console.error(err);

                res.status(500).end();
            } else if (!game) {
                console.log("Request to non-existing game. id: " + id);

                res.status(500).end();
            } else {
                console.dir(game);
                res.render('game', {
                    _id: game._id,
                    title: game.title,
                    capacity: game.capacity,
                    create_time: game.create_time,
                    update_tile: game.update_time
                });
            }
        })
    } else {
        res.redirect('/auth/login');
    }
});

router.post('/create', function (req, res) {
    if (req.isAuthenticated()) {
        var title = req.body.title;
        var capacity = Number(req.body.capacity);

        Game.create(title, capacity, function (err, game) {
            if (err) {
                console.log("Failed to create game.");
                console.error(err);

                res.status(500).end();
            } else {
                var io = req.app.locals.io;
                var nsp = io.of('/' + game._id);
                nsp.on('connection', function (socket) {
                    console.log("on connection at game " + game._id);
                    socket.join(game._id);

                    socket.on('disconnect', function () {

                    });
                });
                res.redirect('/game/' + game._id);
            }
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;
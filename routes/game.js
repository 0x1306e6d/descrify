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
                res.render('game', {
                    game: {
                        id: game._id,
                        title: game.title,
                        ongoing: game.ongoing,
                        capacity: game.capacity,
                        create_time: game.create_time,
                        update_tile: game.update_time
                    },
                    user: {
                        username: req.user.username
                    }
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
                res.redirect('/game/' + game._id);
            }
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;
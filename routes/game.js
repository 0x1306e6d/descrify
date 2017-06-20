const express = require('express');
const router = express.Router();

const Game = require('../src/database/game');

router.get('/:id', function (req, res) {
    var id = req.params.id;
    Game.find(id, function (err, game) {
        if (err) {
            console.error("Failed to find game. id=" + id, err);
            return res.status(500).end();
        }

        if (!game) {
            console.error("Request to non-existing game. id=" + id);
            return res.status(500).end();
        }

        res.render('game', {
            game: {
                id: game._id,
                title: game.title,
                capacity: game.capacity,
                create_time: game.create_time,
                update_tile: game.update_time
            },
            user: {
                username: req.user.username
            }
        });
    });
});

router.post('/create', function (req, res) {
    var title = req.body.title;
    var capacity = Number(req.body.capacity);

    Game.create(title, capacity, function (err, game) {
        if (err) {
            console.error("Failed to create game. title=" + title + ", capacity=" + capacity, err);
            return res.status(500).end();
        }

        res.redirect('/game/' + game._id);
    });
});

module.exports = router;
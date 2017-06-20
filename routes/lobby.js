const express = require('express');
const router = express.Router();

const Game = require('../src/database/game');

router.get('/', function (req, res) {
    Game.findAll(function (err, games) {
        if (err) {
            console.error("Failed to find all games.", err);
            return res.status(500).end();
        }

        res.render('lobby', {
            games: games
        });
    });
});

module.exports = router;
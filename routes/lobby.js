var express = require('express');
var Game = require('../src/database/game');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        Game.findAll(function (err, games) {
            if (err) {
                console.log("Failed to find all games");
                console.error(err);

                res.status(500).end();
            } else {
                res.render('lobby', {
                    games: games
                });
            }
        });
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;
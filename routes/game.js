var express = require('express');
var Game = require('../src/database/game');
var router = express.Router();

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
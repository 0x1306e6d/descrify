var express = require('express');
var router = express.Router();

router.post('/create', function (req, res) {
    if (req.isAuthenticated()) {
        var title = req.body.title;
        var capacity = Number(req.body.capacity);

        console.log("Request to create new game.");
        console.dir(req.body);

        res.status(200).end();
    } else {
        res.status(401).end();
    }
});

module.exports = router;
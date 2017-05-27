var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('lobby');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

module.exports = router;

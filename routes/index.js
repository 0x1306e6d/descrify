var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/lobby');
    } else {
        res.render('intro');
    }
});

module.exports = router;

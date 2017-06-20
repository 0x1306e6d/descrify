const express = require('express');
const router = express.Router();

const auth = require('./auth');
const lobby = require('./lobby');
const game = require('./game');

router.use('/auth', auth);

router.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});
router.use('/', lobby);
router.use('/game', game);

module.exports = router;

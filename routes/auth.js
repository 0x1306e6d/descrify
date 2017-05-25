var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/join', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('join');
    }
});

router.post('/join', passport.authenticate('local-join', {
    successRedirect: '/auth/login',
    failureRedirect: '/auth/join',
    failureFlash: true
}));

module.exports = router;

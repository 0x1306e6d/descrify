const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/logout', function (req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
});

router.use(function (req, res, next) {
    if (req.isUnauthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
});

router.route('/login')
    .get(function (req, res) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    })
    .post(passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        })
    );

router.route('/join')
    .get(function (req, res) {
        res.render('join', {
            message: req.flash('joinMessage')
        });
    })
    .post(passport.authenticate('local-join', {
            successRedirect: '/auth/login',
            failureRedirect: '/auth/join',
            failureFlash: true
        })
    );

router.use(function (req, res) {
    res.redirect('/auth/login');
});

module.exports = router;

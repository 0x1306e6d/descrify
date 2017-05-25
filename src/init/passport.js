var localLogin = require('../auth/local/login');
var localJoin = require('../auth/local/join');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('local-login', localLogin);
    passport.use('local-join', localJoin);

    console.log("Passport is initialized.");
};
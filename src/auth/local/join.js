var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    var user = {
        email: email,
        password: password
    };

    // TODO: implement join

    return done(null, user);
});
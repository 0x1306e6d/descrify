var LocalStrategy = require('passport-local').Strategy;

var findEmail = require('../../account/findEmail');
var findUsername = require('../../account/findUsername');
var insertAccount = require('../../account/insertAccount');

function doJoin(user, callback) {
    findEmail(user.email, function (err, exists) {
        if (err) {
            console.log("Failed to find account. email=" + user.email);
            return callback(err);
        }
        if (exists) {
            return callback(null, null);
        }

        findUsername(user.username, function (err, exists) {
            if (err) {
                console.log("Failed to find username. username=" + user.username);
                return callback(err);
            }
            if (exists) {
                return callback(null, null);
            }

            insertAccount(user, function (err) {
                if (err) {
                    console.log("Failed to insert account. email=" + user.email);
                    return callback(err);
                } else {
                    callback(null, user);
                }
            });
        });
    });
}

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    var user = {
        email: email,
        password: password,
        username: req.body.username
    };

    doJoin(user, function (err, user) {
        if (err) {
            console.log("Failed to join account.");
            console.error(err);

            return done(err);
        }
        if (user) {
            console.log("New account is joined");
            console.dir(user);

            return done(null, user);
        } else {
            return done(null, false, req.flash('joinMessage', "회원 가입을 실패하였습니다."));
        }
    });
});
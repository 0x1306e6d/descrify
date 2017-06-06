var LocalStrategy = require('passport-local').Strategy;
var mariadb = require('../../database/mariadb');

function doLogin(email, password, callback) {
    mariadb.get(function (err, con) {
        if (err) {
            if (con) {
                con.release();
            }
            console.log("Failed to get mariadb.");

            return callback(err);
        }

        var sql = "SELECT id, email, username FROM account WHERE email=? AND password=?";
        var data = [email, password];

        var exec = con.query(sql, data, function (err, result) {
            if (con) {
                con.release();
            }
            console.log("[doLogin] SQL : " + exec.sql);

            if (err) {
                callback(err);
            } else {
                if (result.length > 0) {
                    var user = {
                        id: result[0].id,
                        email: result[0].email,
                        username: result[0].username
                    };

                    callback(null, user);
                } else {
                    callback(null, null);
                }
            }
        });
    });
}

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    doLogin(email, password, function (err, user) {
        if (err) {
            console.log("Failed to login account.");
            console.error(err);

            return done(err);
        }
        if (user) {
            console.log("Account is logged in");
            console.dir(user);

            return done(null, user);
        } else {
            return done(null, false, req.flash('loginMessage', "계정이 존재하지 않거나 비밀번호가 틀렸습니다."));
        }
    })
});
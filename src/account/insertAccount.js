var mariadb = require('../database/mariadb');

module.exports = function (user, callback) {
    mariadb.get(function (err, con) {
        if (err) {
            if (con) {
                con.release();
            }
            console.log("Failed to get mariadb.");

            return callback(err);
        }

        var sql = "INSERT INTO account SET ?";
        var data = {
            email: user.email,
            password: user.password,
            username: user.username
        };

        var exec = con.query(sql, data, function (err, result) {
            if (con) {
                con.release();
            }
            console.log("[insertAccount] SQL : " + exec.sql);

            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};
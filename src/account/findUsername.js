var mariadb = require('../database/mariadb');

module.exports = function (username, callback) {
    mariadb.get(function (err, con) {
        if (err) {
            if (con) {
                con.release();
            }
            console.log("Failed to get mariadb.");

            return callback(err);
        }

        var sql = "SELECT username FROM account WHERE username=?";
        var data = [username];

        var exec = con.query(sql, data, function (err, result) {
            if (con) {
                con.release();
            }
            console.log("[findUsername] SQL : " + exec.sql);

            if (err) {
                callback(err);
            } else {
                callback(null, (result.length > 0));
            }
        });
    });
};
var mysql = require('mysql');
var mariadb = {};

var pool;

mariadb.createPool = function (config, callback) {
    pool = mysql.createPool({
        host: config.url,
        user: config.user,
        password: config.password,
        database: config.database
    });
    pool.getConnection(function (err, con) {
        if (con) {
            con.release();
        }

        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

mariadb.get = function (callback) {
    pool.getConnection(callback);
};

module.exports = mariadb;
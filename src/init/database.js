var mariadb = require('../database/mariadb');
var Game = require('../database/game');

module.exports = function (config) {
    mariadb.createPool(config.mariadb, function (err) {
        if (err) {
            console.error("Failed to create MariaDB connection pool.");
            throw err;
        }
        console.log("MariaDB connection pool is created");
        console.log("MariaDB is initialized.");
    });
    Game.setup(config.mongodb);
};
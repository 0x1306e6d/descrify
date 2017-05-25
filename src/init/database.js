var mariadb = require('../database/mariadb');

module.exports = function (config) {
    mariadb.createPool(config, function (err) {
        if (err) {
            console.error("Failed to create MariaDB connection pool.");
            throw err;
        }
        console.log("MariaDB connection pool is created");
        console.log("MariaDB is initialized.");
    });
};
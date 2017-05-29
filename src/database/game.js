var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = {};

var database;
var GameSchema;
var GameModel;

function init() {
    GameSchema = new Schema({
        title: {type: String},
        capacity: {type: Number, default: 4},
        create_time: {type: Date, default: Date.now},
        update_time: {type: Date, default: Date.now}
    });
    console.log("GameSchema is initialized.");

    GameModel = mongoose.model("game", GameSchema);
    console.log("GameModel is initialized.");
}

game.setup = function (config) {
    mongoose.connect(config.url + "/game");
    database = mongoose.connection;

    database.on('error', console.error.bind(console, "Error from mongoose : "));
    database.once('open', init);
    database.on('disconnected', game.setup);
};

game.create = function (title, capacity, callback) {
    var game = new GameModel();
    game.title = title;
    game.capacity = capacity;
    game.create_time = Date.now();
    game.update_time = game.create_time;

    game.save(function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, game);
    });
};

game.findAll = function (callback) {
    GameModel.find(callback);
};

game.find = function (id, callback) {
    GameModel.findOne({
        _id: id
    }, 'title capacity create_time update_time', function (err, game) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, game);
        }
    });
};

module.exports = game;
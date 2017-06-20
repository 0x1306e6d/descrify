var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = {};
var events = [];

var database;
var GameSchema;
var GameModel;

function init() {
    GameSchema = new Schema({
        title: {type: String},
        ongoing: {type: Boolean, default: false},
        size: {type: Number, default: 0},
        capacity: {type: Number, default: 4},
        users: {type: [String]},
        create_time: {type: Date, default: Date.now},
        update_time: {type: Date, default: Date.now}
    });
    var len = events.length;
    for (var i = 0; i < len; i++) {
        GameSchema.post(events[i].on, events[i].handler);
    }
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

    game.save(function (err) {
        if (err) {
            return callback(err);
        } else {
            callback(null, game);
        }
    });
};

game.findAll = function (callback) {
    GameModel.find(callback);
};

game.find = function (id, callback) {
    GameModel.findOne({_id: id}, function (err, game) {
        if (err) {
            return callback(err);
        } else {
            callback(null, game);
        }
    });
};

game.participate = function (gameId, username, callback) {
    GameModel.findOne({_id: gameId}, function (err, game) {
        if (err) {
            return callback(err);
        }

        if (game.size >= game.capacity) {
            return callback(new Error("Game is full."));
        } else {
            var index = game.users.indexOf(username);
            if (index >= 0) {
                return callback(new Error("Already participate in game."));
            }

            game.users.push(username);
            game.size++;
            game.save(function (err) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

game.exit = function (gameId, username, callback) {
    GameModel.findOne({_id: gameId}, function (err, game) {
        if (err) {
            return callback(err);
        }

        var index = game.users.indexOf(username);
        if (index === -1) {
            return callback(new Error("Exit game which not participate in"));
        }

        game.users.splice(index, 1);
        game.size--;
        if (game.size > 0) {
            game.save(function (err) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null);
                }
            });
        } else {
            game.remove(function (err) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

game.registerMiddleware = function (on, handler) {
    events.push({
        on: on,
        handler: handler
    });
    if (GameSchema) {
        GameSchema.post(on, handler);
    }
};

module.exports = game;
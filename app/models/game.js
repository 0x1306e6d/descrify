const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: String,
    ongoing: {type: Boolean, default: false},
    size: {type: Number, default: 0},
    capacity: {type: Number, default: 4},
    examiner: Number,
    users: [],
    create_time: {type: Date, default: Date.now},
    update_time: {type: Date, default: Date.now}
});

schema.post('remove', function (game) {
    schema.statics.onRemove(game);
});

schema.statics.create = function (args, callback) {
    const game = new this(args);
    game.save(callback);

    schema.statics.onCreate(game);
};

schema.methods.participate = function (user, callback) {
    if (this.size >= this.capacity) {
        return callback(null, null);
    }

    if (this.users.indexOf(user) !== -1) {
        return callback(new Error("이미 게임에 존재하는 유저가 참가하였습니다. user=" + user));
    }

    this.users.push(user);
    this.size++;
    this.markModified(['users', 'size']);
    this.save(callback);
};

schema.methods.exit = function (user, callback) {
    var index = this.users.indexOf(user);
    if (index === -1) {
        return callback(new Error("게임에 존재하지 않는 유저가 퇴장하였습니다. user=" + user));
    }

    this.users.splice(index, 1);
    this.size--;

    if (this.size > 0) {
        this.markModified(['users', 'size']);
        this.save(callback);
    } else {
        this.remove(callback);
    }
};

module.exports = mongoose.model('game', schema);
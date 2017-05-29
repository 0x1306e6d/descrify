var express = require('express');
var http = require('http');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var config = require('./src/config');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var lobby = require('./routes/lobby');
var game = require('./routes/game');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'descrify',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/lobby', lobby);
app.use('/game', game);

var err404 = require('./err/404');
var err = require('./err/err');
app.use(err404);
app.use(err);

var initPassport = require('./src/init/passport');
initPassport(passport);

var initDatabase = require('./src/init/database');
initDatabase(config);

var server = http.createServer(app);
var io = require('socket.io')(server);

game = io.of('/game');
game.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log("on disconnect");
        socket.broadcast.to(socket.game).emit('bye', {username: socket.username});
    });
    socket.on('enter', function (data) {
        console.log("on enter");
        var id = data.id;
        var username = data.username;

        socket.game = id;
        socket.username = username;

        socket.join(socket.game);
        socket.broadcast.to(socket.game).emit('hello', {username: socket.username});
    });
    socket.on('players', function () {
        console.log("on players");

        game.in(socket.game).clients(function (err, clients) {
            var players = [];
            clients.forEach(function (client) {
                var player = game.connected[client];
                players.push({
                    username: player.username
                });
            });

            socket.emit('players', {players: players});
        });
    })
});

app.locals.server = server;
app.locals.io = io;

module.exports = app;

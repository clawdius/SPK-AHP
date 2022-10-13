const express = require('express');
const session = require('express-session');
const SQLiteSession = require('connect-sqlite3')(session)

const app = express();
const path = require('path');

const passport = require('passport')

//Start Server di port 8000
app.listen(8000);

//Set assets
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-table/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap-table/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/mathjs/lib/browser')));

//Set View Engine
app.set('view engine', 'ejs');

//JSON
app.use(express.urlencoded({
    extended: true
}));

//Setting Session
app.use(session({
    secret: 'YaAllahSeoyoungCantikBanget',
    store: new SQLiteSession({ db: 'user_session.db' }),
    cookie: { maxAge: 12 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false
}));

//Setting Passport
app.use(passport.initialize());
app.use(passport.session());

//Database Connection
require('./config-app/config-db')

//Routers
app.use(require('./routers/router-default'));
app.use(require('./routers/router-rekrutmen'));
app.use(require('./routers/router-bagian'));
app.use(require('./routers/router-calonkry'));

//404
app.use(function(req, res) {
    res.status(404)
    res.send('Halaman tidak ditemukan')
})
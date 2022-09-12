const express = require('express');
const app = express();
const path = require('path');

//Start Server di port 8000
app.listen(8000);

//Set assets
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

//Set View Engine
app.set('view engine', 'ejs');

//JSON
app.use(express.urlencoded({
    extended: true
}));

//Database Connection
require('./config-db')

//Routers
app.use(require('./routers/router-default'))

//404
app.use(function(req, res) {
    res.status(404)
    res.send('Halaman tidak ditemukan')
})
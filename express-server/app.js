var express = require('express');
var yields = require('express-yields');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var rethinkdb = require('rethinkdb');

var config = require('./config');
var ormiggaRoutes = require('./routes/ormigga.route');

// define our app using express
var app = express();

// allow-cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware that will create a connection to the database
app.use(createConnection);

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function createConnection(req, res, next) {
    rethinkdb.connect(config.rethinkdb).then(function (conn) {
        req._rdbConn = conn;
        next();
    }).error(handleError(res));
}

/*
 * Close the RethinkDB connection
 */
function closeConnection(req, res, next) {
    req._rdbConn.close();
}

/*
 * Send back a 500 error
 */
function handleError(res) {
    return function(error) {
        res.send(500, {error: 'Base de Datos no conectada -> ' + error.message});
    }
}

app.use('/api', ormiggaRoutes);
app.get('/', (req, res) => {
    return res.end('Ormigga Api working');
});

// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

// Middleware to close a connection to the database
app.use(closeConnection);

module.exports = app;
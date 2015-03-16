var express = require('express');
var app = express();

// this logger prints requests to STDOUT
var logger = require('./../lib/traffic-tracker').logger({out: 'stdout'});

// this one saves the data to mongodb
var loggerMongo = require('./../lib/traffic-tracker').logger({out: 'mongodb', config:{url: 'localhost'}});

// used both loggers
app.use(logger);
app.use(loggerMongo);

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/delay/:time', function(req, res) {
    var time = parseInt(req.params.time) || 1000;

    setTimeout(function() { res.status(200).send({status: 'done'});}, time);
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

});
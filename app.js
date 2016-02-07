var express = require('express');
var app = express();
var Sequelize = require('sequelize');


app.get('/', function(req, res) {
    res.send('derp');
});

app.listen(8000, function() {
    console.log('App listening on port 8000.');
});

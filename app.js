var express = require('express');
var app = express();

var cons = require('consolidate');

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('index', {title: 'welcome to config modifier'});
});

var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});

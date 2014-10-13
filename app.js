var express = require('express');
var app = express();

var cons = require('consolidate');

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('index', {title: 'welcome to config modifier'});
});

app.get('/api/configs', function(req, res) {
  res.json({
    config: {
      name: 'test',
      desc: 'test desc'
  }});
});

app.get('/api/nodes', function(req, res) {
  res.json(['node1', 'node2', 'node3']);
});

app.get('/api/nodes/node1', function(req, res) {
  res.json({
    cversion: -1,
    dataVersion: 0,
    aclVersion: 0
  });
});

var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});

var express = require('express');
var app = express();

var cons = require('consolidate');

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/api/configs', function(req, res) {
  res.json({
    config: {
      name: 'test',
      desc: 'test desc'
  }});
});

var Zookeeper = require('zookeeper');

var url = require('./url.js');
app.get('/api/*', function(req, res) {
  var path = req.param(0);

  if (path.length === 0) {
    res.json({err: 'path is empty'});
    res.status(400).end();
    return;
  }

  path = url.escape(path);

  var zk = new Zookeeper({
    connect: 'localhost:2181',
    timeout: 2000
  });

 zk.connect(function(err) {
    if (err) throw err;
    zk.a_get_children2('/' + path, null, function(rc, error, children, stat) {
      res.json({
        children: children,
        stat: stat,
        error: error,
        rc: rc
      });
      res.status(200).end();
      zk.close();
    });
  });
});

app.get('/*', function(req, res) {
  var path = req.param(0);
  if (path.length === 0) {
    path = '/';
  }

  path = url.escape(path);
  res.render('index', {
    title: 'welcome to config modifier',
    path: path
  });
});

var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});

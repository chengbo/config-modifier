var express = require('express');
var app = express();
var Promise = require('bluebird');

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

  function connectAsync() {
    return new Promise(function(resolve, reject) {
      zk.connect(function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  function getChildren2Async() {
    return new Promise(function(resolve, reject) {
      zk.a_get_children2('/' + path, null, function(rc, error, children, stat) {
        if (rc === -101) {
          reject({
            code: rc,
            error: error
          });
        }
        else {
          resolve({
            children: children,
            stat: stat
          });
        }
      });
    });
  }

  connectAsync().then(
    getChildren2Async
  ).then(function(data) {
      res.json({
        children: data.children,
        stat: data.stat
      });
      res.status(200).end();
      zk.close();
  }).catch(function(err) {
    res.status(404).json(err);
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

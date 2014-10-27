var express = require('express');
var app = express();
var zr = require('./zkpromise');

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

var url = require('./url.js');
app.get('/api/*', function(req, res) {
  var path = req.param(0);

  if (path.length === 0) {
    res.json({err: 'path is empty'});
    res.status(400).end();
    return;
  }

  path = url.escape(path);

  new zr().get('/' + path)
    .then(function(result) {
      res.json({
        children: result.children,
        stat: result.stat,
        data: result.data
    });
    res.status(200).end();
  })
  .catch(function(err) {
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

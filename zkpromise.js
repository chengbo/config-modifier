var Zookeeper = require('zookeeper');
var Promise = require('bluebird');

function ZkWrapper() {
  this.zk = new Zookeeper({
    connect: 'localhost:2181',
    timeout: 2000
  });
  this.zk.data_as_buffer = false;
}

function connect() {
  var zk = this.zk;
  return new Promise(function(resolve, reject) {
    zk.connect(function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}


function getChildren(path) {
  var zk = this.zk;
  return new Promise(function(resolve, reject) {
    zk.a_get_children(path, null, function(rc, error, children) {
      if (rc === -101) {
        reject({
          code: rc,
          error: error
        });
      } else {
        resolve(children);
      }
    });
  });
}

function get(path) {
  var zk = this.zk;
  return new Promise(function(resolve, reject) {
    zk.a_get(path, null, function(rc, error, stat, data) {
      if (rc === -101) {
        reject({
          code: rc,
          error: error
        });
      } else {
        resolve({
          stat: stat,
          data: data
        });
      }
    });
  });
}

ZkWrapper.prototype.get = function(path) {
  var self = this;
  return connect.call(self).then(function() {
    return Promise.props({
      children: getChildren.call(self, path),
      data: get.call(self, path)
    });
  }).then(function(result) {
    return {
      children: result.children,
      stat: result.data.stat,
      data: result.data.data
    };
  });
};

module.exports = ZkWrapper;

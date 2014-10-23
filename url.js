exports.escape = function(input) {
  return input.match(/([^\/]+)/g).join('/');
};

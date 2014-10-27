exports.escape = function(input) {
  var matches = input.match(/([^\/]+)/g);
  if (matches === null) return '';
  return matches.join('/');
};

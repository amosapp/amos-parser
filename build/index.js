"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// TODO: rewrite
var filePath = _path["default"].join(__dirname, '.', 'all');

var file = _fs["default"].readFileSync(filePath, 'utf8');

var TAB = 2;

var setToValue = function setToValue(obj, value, path) {
  var i;
  path = path.split('.');

  for (i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];
  }

  obj[path[i]] = value;
};

var parse = function parse(data) {
  var arrOfLines = data.split('\n');
  var parents = [];
  var obj = {};

  for (var i = 0; i < arrOfLines.length; i++) {
    var line = arrOfLines[i]; // const splitLine = line.split(/\S/)

    var numberOfSpaces = line.search(/\S/);
    var indentation = numberOfSpaces / TAB; // console.log('indentation', arrOfLines[i], indentation)

    if (indentation < 0) continue;
    var topic = line.substring(numberOfSpaces);
    console.log('topic', topic);

    switch (indentation) {
      case 0:
        // create object
        setToValue(obj, {}, topic); // create parents

        parents = [topic];
        break;

      case 1:
        setToValue(obj, {}, "".concat(parents[0], ".").concat(topic));
        parents = [parents[0], topic];
        break;

      case 2:
        setToValue(obj, {}, "".concat(parents[0], ".").concat(parents[1], ".").concat(topic));
        parents = [parents[0], parents[1], topic];
        break;
    }
  }

  return obj;
};

var parsed = parse(file);
console.log('parsed', parsed);
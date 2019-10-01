"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPascalCase = exports.superReduce = exports.reduceIndexed = exports.mapFilter = exports.appendIfNot = void 0;

var R = _interopRequireWildcard(require("ramda"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var
/**
 * @description 
 * @param skip 
 * @param fn
 * @param 
 */
appendIfNot = function appendIfNot(skip) {
  return function (fn) {
    return function (acc, val) {
      return R.ifElse(R.equals(skip))(R.always(acc))(R.flip(R.append)(acc))(fn(val));
    };
  };
},

/**
 * @description 
 * @param skip 
 * @param fn
 * @param arr
 */
mapFilter = function mapFilter(skip) {
  return function (fn) {
    return function (arr) {
      return R.reduce(appendIfNot(skip)(fn))([])(arr);
    };
  };
},
    reduceIndexed = R.addIndex(R.reduce),

/**
 * @description Like reduce but you get (acc, val, i, arr)!
 */
superReduce = function superReduce(fn) {
  return function (baseCase) {
    return function (arr) {
      return reduceIndexed(function (acc, val, i) {
        return fn(acc, val, i, arr);
      })(baseCase)(arr);
    };
  };
},
    toPascalCase = function toPascalCase(string, lineIndex) {
  var words = string.split(' ');
  var wordsWithoutInvalidChars = words.map(function (word) {
    return word.replace(/\W/g, '');
  });
  var pascalCaseArr = wordsWithoutInvalidChars.map(function (word) {
    word = word.toLowerCase();

    if (word[0] && word[0].toUpperCase() && word.substring(1)) {
      var pascalCase = word[0].toUpperCase() + word.substring(1);
      return pascalCase;
    } else {
      throw "Bad topic name: ".concat(string, ", ").concat(wordsWithoutInvalidChars, ", ").concat(lineIndex);
    }
  });
  return pascalCaseArr.join('');
};

exports.toPascalCase = toPascalCase;
exports.superReduce = superReduce;
exports.reduceIndexed = reduceIndexed;
exports.mapFilter = mapFilter;
exports.appendIfNot = appendIfNot;
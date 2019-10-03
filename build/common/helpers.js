"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.includes = exports.assert = exports.lines = exports.toPascalCase = exports.adjustString = exports.words = exports.superMap = exports.superReduce = exports.mapFilter = exports.appendIfNot = void 0;var R = _interopRequireWildcard(require("ramda"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function _getRequireWildcardCache() {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};if (obj != null) {var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj["default"] = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

var

/**
     * @description 
     * @param skip 
     * @param fn
     * @param 
     */

appendIfNot = function appendIfNot(skip) {return function (fn) {return function (acc, val) {return R.ifElse(R.equals(skip))(R.always(acc))(R.flip(R.append)(acc))(fn(val));};};},

/**
                                                                                                                                                                                   * @description 
                                                                                                                                                                                   * @param skip 
                                                                                                                                                                                   * @param fn
                                                                                                                                                                                   * @param arr
                                                                                                                                                                                   */
mapFilter = function mapFilter(skip) {return function (fn) {return function (arr) {return R.reduce(appendIfNot(skip)(fn))([])(arr);};};},

/**
                                                                                                                                           * @description Like reduce but you get (acc, val, i, arr)!
                                                                                                                                           */
superReduce = function superReduce(fn) {return function (baseCase) {return function (arr) {return R.addIndex(R.reduce)(function (acc, val, i) {return fn(acc)(val)(i)(arr);})(baseCase)(arr);};};},
// superReduce = fn => baseCase => arr => R.addIndex (R.reduce) ((acc, val, i) => fn (acc) (val) (i) (arr)) (baseCase) (arr),

/**
 * @description Like map but you get (val, i, arr)!
 */
superMap = function superMap(fn) {return function (arr) {return R.addIndex(R.map)(function (val, i) {return fn(val)(i)(arr);})(arr);};},
// superMap = fn => arr => R.addIndex (R.map) ((val, i) => fn (val) (i) (arr)) (arr),

words = R.split(" "),

adjustString = R.curryN(3)(R.pipe(R.adjust, R.join(""))),

toPascalCase = R.pipe(
words,
R.map(adjustString(0)(R.toUpper)),
R.join("")),

// const words = s.split(' ')
//   const wordsWithoutInvalidChars = words.map(word => word.replace(/\W/g, ''))
//   const pascalCaseArr = wordsWithoutInvalidChars.map(word => {
//     word = word.toLowerCase()
//     if (word[0] && word[0].toUpperCase() && word.substring(1)) {
//       const pascalCase = word[0].toUpperCase() + word.substring(1)
//       return pascalCase
//     } else {
//       throw(`Bad topic name: ${s}, ${wordsWithoutInvalidChars}, ${lineIndex}`)
//     }
//   })
//   return pascalCaseArr.join('')
// },

lines = R.split("\n"),

assert = function assert(pr) {return function (st) {
    pr ?
    null : function (e) {throw e;}(
    new Error("ERROR: ".concat(st, ".")));
  };},

includes = R.curry(function (s, list) {return R.useWith(R.includes)([R.toLower, R.map(R.toLower)])(s, list);});exports.includes = includes;exports.assert = assert;exports.lines = lines;exports.toPascalCase = toPascalCase;exports.adjustString = adjustString;exports.words = words;exports.superMap = superMap;exports.superReduce = superReduce;exports.mapFilter = mapFilter;exports.appendIfNot = appendIfNot;
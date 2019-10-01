"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cypher = exports["default"] = void 0;

var _common = require("./common");

var _parse = _interopRequireDefault(require("./parse"));

var _cypher = _interopRequireDefault(require("./cypher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _parse["default"];
exports["default"] = _default;

var cypher = _common.R.pipe(_parse["default"], _cypher["default"]);

exports.cypher = cypher;
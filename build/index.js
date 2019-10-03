"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.amosToCypher = exports["default"] = void 0;var _common = require("./common");
var _amosToJson = _interopRequireDefault(require("./amos-to-json"));
var _jsonToCypher = _interopRequireDefault(require("./json-to-cypher"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}var _default =

_amosToJson["default"];exports["default"] = _default;
var amosToCypher = _common.R.pipe(_amosToJson["default"], _jsonToCypher["default"]);exports.amosToCypher = amosToCypher;
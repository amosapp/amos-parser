"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// const fs = require('fs');
// const path = require('path');
// const filePath = path.join(__dirname, '..', 'all');
// const file = fs.readFileSync(filePath, 'utf8');
var INDENTATION_LIMIT = 0;
var TAB = 2;

var last = function last(arr) {
  return arr[arr.length - 1];
};

var toPascalCase = function toPascalCase(string, lineIndex) {
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

var parse = function parse(data) {
  var arrOfLines = data.split('\n');
  var parents = [];
  var topicsCum = [];
  var query = '';

  for (var i = 0; i < arrOfLines.length; i++) {
    var line = arrOfLines[i]; // allow blank spaces

    if (line === '') continue;
    var numberOfSpaces = line.search(/\S/);
    var indentation = numberOfSpaces / TAB; // console.log('indentation', arrOfLines[i], indentation)

    var topicsString = line.substring(numberOfSpaces); // allow comments (#)

    if (topicsString[0] === '#') continue;
    var topics = topicsString.split(' / ');
    var primaryTopicPascalCase = toPascalCase(topics[0], i);
    var createNode = "CREATE (".concat(primaryTopicPascalCase, ":Topic {name: '").concat(primaryTopicPascalCase, "', names:['").concat(topics, "']})\n");

    var createRelationship = function createRelationship(child, parent) {
      return "CREATE (".concat(child, ")-[:IS_PART_OF]->(").concat(parent, ")\n");
    };

    if (indentation === 0) {
      query += createNode; // update topicsCum

      topicsCum.push(topics); // create parents

      parents = [primaryTopicPascalCase];
    } else if (indentation > 0 && (INDENTATION_LIMIT === 0 || indentation <= INDENTATION_LIMIT)) {
      // console.log('primaryTopicPascalCase, indentation, parents, ', primaryTopicPascalCase, indentation, parents, )
      parents = parents.slice(0, indentation);
      var match = 0;

      for (var _i = 0; _i < topicsCum.length; _i++) {
        for (var j = 0; j < topicsCum[_i].length; j++) {
          for (var k = 0; k < topics.length; k++) {
            if (topicsCum[_i][j] === topics[k]) {
              match = _i;
            }
          }
        }
      }

      if (match > 0) {
        // not very rigorous
        // console.log('MATCH!', )
        var primaryTopic = toPascalCase(topicsCum[match][0], 0);
        query += createRelationship(primaryTopic, last(parents));
        parents.push(primaryTopic);
      } else {
        query += createNode;
        query += createRelationship(primaryTopicPascalCase, last(parents));
        topicsCum.push(topics);
        parents.push(primaryTopicPascalCase);
      }
    }
  }

  return query;
};

var _default = parse; // // Out
// let output = parse(file)
// output += `
// WITH Mathematics as m
// MATCH (a) RETURN a
// `

exports["default"] = _default;
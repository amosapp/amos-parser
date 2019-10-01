"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./common");

var INDENTATION_LIMIT = 0,
    TAB = 2,
    handleLine = function handleLine(acc, line, i, data) {},
    parse = function parse(data) {
  return _common.H.superReduce(handleLine)("")(_common.R.split("\n")(data));
};

var _default = parse; // for (let i = 0; i < arrOfLines.length; i++) {
//     const line = arrOfLines[i]
//     // allow blank spaces
//     if (line === '') continue;
//     const numberOfSpaces = line.search(/\S/)
//     const indentation = numberOfSpaces / TAB
//     // console.log('indentation', arrOfLines[i], indentation)
//     const topicsString = line.substring(numberOfSpaces)
//     // allow comments (#)
//     if (topicsString[0] === '#') continue;
//     const topics = topicsString.split(' / ')
//     const primaryTopicPascalCase = toPascalCase(topics[0], i)
//     const createNode = `CREATE (${primaryTopicPascalCase}:Topic {name: '${primaryTopicPascalCase}', names:['${topics}']})\n`
//     const createRelationship = (child, parent) => `CREATE (${child})-[:IS_PART_OF]->(${parent})\n`
//     if (indentation === 0) {
//       query += createNode
//       // update topicsCum
//       topicsCum.push(topics)
//       // create parents
//       parents = [primaryTopicPascalCase]
//     } else if (indentation > 0 && (INDENTATION_LIMIT === 0 || indentation <= INDENTATION_LIMIT)) {
//       // console.log('primaryTopicPascalCase, indentation, parents, ', primaryTopicPascalCase, indentation, parents, )
//       parents = parents.slice(0, indentation)
//       let match = 0
//       for (let i = 0; i < topicsCum.length; i++) {
//         for (let j = 0; j < topicsCum[i].length; j++) {
//           for (let k = 0; k < topics.length; k++) {
//             if (topicsCum[i][j] === topics[k]) {
//               match = i
//             }
//           }
//         }
//       }
//       if (match > 0) {
//         // not very rigorous
//         // console.log('MATCH!', )
//         const primaryTopic = toPascalCase(topicsCum[match][0], 0)
//         query += createRelationship(primaryTopic, last(parents))
//         parents.push(primaryTopic)
//       } else {
//         query += createNode
//         query += createRelationship(primaryTopicPascalCase, last(parents))
//         topicsCum.push(topics)
//         parents.push(primaryTopicPascalCase)
//       }
//     }
//   }
//   return query
// }

exports["default"] = _default;
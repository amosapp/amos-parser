

// const fs = require('fs');
// const path = require('path');

// const filePath = path.join(__dirname, '..', 'all');
// const file = fs.readFileSync(filePath, 'utf8');

const INDENTATION_LIMIT = 0
const TAB = 2

const last = arr => arr[arr.length - 1]

const toPascalCase = (string, lineIndex) => {
  const words = string.split(' ')
  const wordsWithoutInvalidChars = words.map(word => word.replace(/\W/g, ''))
  const pascalCaseArr = wordsWithoutInvalidChars.map(word => {
    word = word.toLowerCase()
    if (word[0] && word[0].toUpperCase() && word.substring(1)) {
      const pascalCase = word[0].toUpperCase() + word.substring(1)
      return pascalCase
    } else {
      throw(`Bad topic name: ${string}, ${wordsWithoutInvalidChars}, ${lineIndex}`)
    }
  })
  return pascalCaseArr.join('')
}

const parse = (data) => {
  const arrOfLines = data.split('\n')
  let parents = []
  let topicsCum = []
  let query = ''
  for (let i = 0; i < arrOfLines.length; i++) {
    const line = arrOfLines[i]

    // allow blank spaces
    if (line === '') continue;

    const numberOfSpaces = line.search(/\S/)
    const indentation = numberOfSpaces / TAB
    // console.log('indentation', arrOfLines[i], indentation)

    const topicsString = line.substring(numberOfSpaces)
    
    // allow comments (#)
    if (topicsString[0] === '#') continue;
    
    const topics = topicsString.split(' / ')
    const primaryTopicPascalCase = toPascalCase(topics[0], i)
    
    const createNode = `CREATE (${primaryTopicPascalCase}:Topic {name: '${primaryTopicPascalCase}', names:['${topics}']})\n`
    const createRelationship = (child, parent) => `CREATE (${child})-[:IS_PART_OF]->(${parent})\n`


    if (indentation === 0) {
      console.log(createNode)
      // update topicsCum
      topicsCum.push(topics)
      // create parents
      parents = [primaryTopicPascalCase]
    } else if (indentation > 0 && (INDENTATION_LIMIT === 0 || indentation <= INDENTATION_LIMIT)) {
  
      // console.log('primaryTopicPascalCase, indentation, parents, ', primaryTopicPascalCase, indentation, parents, )
      parents = parents.slice(0, indentation)
      let match = 0

      for (let i = 0; i < topicsCum.length; i++) {
        for (let j = 0; j < topicsCum[i].length; j++) {
          for (let k = 0; k < topics.length; k++) {
            if (topicsCum[i][j] === topics[k]) {
              match = i
            }
          }
        }
      }

      if (match > 0) {
        // not very rigorous
        // console.log('MATCH!', )
        const primaryTopic = toPascalCase(topicsCum[match][0], 0)
        console.log(createRelationship(primaryTopic, last(parents)))
        parents.push(primaryTopic)
      } else {
        console.log(createNode)
        console.log(createRelationship(primaryTopicPascalCase, last(parents)))
        topicsCum.push(topics)
        parents.push(primaryTopicPascalCase)
      }
    }
  }

  return query
}

export default parse

// // Out
// let output = parse(file)

// output += `
// WITH Mathematics as m
// MATCH (a) RETURN a
// `


import fs from 'fs'
import path from 'path'

// TODO: rewrite better

// const filePath = path.join(__dirname, '.', 'all');
// const file = fs.readFileSync(filePath, 'utf8');

const TAB = 2

const setToValue = (obj, value, path) => {
  var i;
  path = path.split('.');
  for (i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];
  }
  obj[path[i]] = value;
}

const parse = data => {
  const arrOfLines = data.split('\n')
  let parents = []
  let obj = {}
  for (let i = 0; i < arrOfLines.length; i++) {
    const line = arrOfLines[i]
    // const splitLine = line.split(/\S/)
    const numberOfSpaces = line.search(/\S/)
    const indentation = numberOfSpaces / TAB
    // console.log('indentation', arrOfLines[i], indentation)

    if (indentation < 0) continue;

    const topic = line.substring(numberOfSpaces)
    console.log('topic', topic)
    switch (indentation) {
      case 0:
        // create object
        setToValue(obj, {}, topic)
        // create parents
        parents = [topic]
        break;
      case 1:
        setToValue(obj, {}, `${parents[0]}.${topic}`)
        parents = [parents[0], topic]
        break;
      case 2:
        setToValue(obj, {}, `${parents[0]}.${parents[1]}.${topic}`)
        parents = [parents[0], parents[1], topic]
        break;
    }
  }

  return obj
}

export default parse

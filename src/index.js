import {R} from './common'
import amosToJson from './amos-to-json'
import jsonToCypher from './json-to-cypher'

export default amosToJson
export const amosToCypher = R.pipe (amosToJson, jsonToCypher)

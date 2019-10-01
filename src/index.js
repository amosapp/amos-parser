import {R} from './common'
import parse from './parse'
import cypherOnly from './cypher'

export default parse
export const cypher = R.pipe (parse, cypherOnly) 

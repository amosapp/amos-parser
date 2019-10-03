import * as R from 'ramda'

export const

/**
 * @description 
 * @param skip 
 * @param fn
 * @param 
 */

appendIfNot = skip => fn => (acc, val) => R.ifElse (R.equals (skip)) (R.always (acc)) (R.flip (R.append) (acc)) (fn (val)),

/**
 * @description 
 * @param skip 
 * @param fn
 * @param arr
 */
mapFilter = skip => fn => arr => R.reduce (appendIfNot (skip) (fn)) ([]) (arr),

/**
 * @description Like reduce but you get (acc, val, i, arr)!
 */
superReduce = fn => baseCase => arr => R.addIndex (R.reduce) ((acc, val, i) => fn (acc) (val) (i) (arr)) (baseCase) (arr),
// superReduce = fn => baseCase => arr => R.addIndex (R.reduce) ((acc, val, i) => fn (acc) (val) (i) (arr)) (baseCase) (arr),

/**
 * @description Like map but you get (val, i, arr)!
 */
superMap = fn => arr => R.addIndex (R.map) ((val, i) => fn (val) (i) (arr)) (arr),
// superMap = fn => arr => R.addIndex (R.map) ((val, i) => fn (val) (i) (arr)) (arr),

words = R.split (` `),

adjustString = R.curryN (3) (R.pipe (R.adjust, R.join (``))),

toPascalCase = R.pipe(
  words,
  R.map (adjustString (0) (R.toUpper)),
  R.join (``)
),
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

lines = R.split (`\n`),

assert = pr => st => {
  pr
    ? null
    : throw new Error(`ERROR: ${st}.`)
},

includes = R.curry((s, list) => R.useWith (R.includes) ([R.toLower, R.map (R.toLower)]) (s, list))
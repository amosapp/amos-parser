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

reduceIndexed = R.addIndex (R.reduce),

/**
 * @description Like reduce but you get (acc, val, i, arr)!
 */
superReduce = fn => baseCase => arr => reduceIndexed ((acc, val, i) => fn (acc, val, i, arr)) (baseCase) (arr),

toPascalCase = (string, lineIndex) => {
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

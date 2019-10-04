import {R, H} from './common'

const {default: topics} = require (`@solviofoundation/amos-topics`)

const
// topics = `
// test
//     test
//     test
//   test
// `,

INDENTATION_LIMIT = 0,
TAB = 2,

// prepare_line = (acc, line, i, lines) => {
  
// },

/* [graph, nodes idx, idx, current ind, next ind] */
baseCase = [{nodes: [{id:`Academic`, metadata: {names: [`Academic`]}}], edges: []}, 0],

// parse = (lines) => ({
//   graph: H.superReduce (prepare_line) (baseCase) (lines)
// })

prepare_line = R.juxt([
  R.pipe (R.match (/^\s*/g), R.nth (0), R.length),
  R.trim
]),

// handleLine = (acc, [ind, name], i , arr) => {
//   H.assert (ind % TAB === 0) (`incorrect indentation at ${i}: ${name}`)
//   const names = R.map (R.path ([`metadata`, `names`])) (acc.nodes)
//   const idx = H.findIndex (R.pipe (R.nth (0), R.gte (val[0]))) (R.slice (i + 1) (Infinity) (arr))
//   // const directChildren = R.slice ()

  
//   // console.log (val, idx)
// },

// addEdge = ,

createGraph = graph => nodes_idx => name => {
  const names = R.split (` / `) (name)
  const {nodes, edges} = graph

  // const nodes = R.filter (R.pipe (R.path ([`metadata`, `names`]), R.includes (name))) (graph.nodes)
  // const nodes = R.innerJoin ((node, name) => R.pipe (R.path ([`metadata`, `names`]), R.includes (name))) (graph.nodes) (names)
  // const nodes = R.innerJoin (R.converge (R.includes, [R.nthArg (1), R.path ([`metadata`, `names`])])) (graph.nodes) (names)
  const nodes_sat = R.innerJoin (
    R.useWith (
      R.flip (H.includes),
      [R.path ([`metadata`, `names`]), R.identity]
    )
  )
  (nodes)
  (names)

  H.assert (R.length (nodes_sat) <= 1) (`problem at: ${name}`)

  if (R.isEmpty (nodes_sat)) {
    /* Add new node */
    // return addEdge (graph) (nodes_idx) (name)
    const id = H.toPascalCase(names[0])
    const node = {id, metadata: {names}}

    const graph_ = {nodes: R.append (node) (nodes), edges: R.append ({source: id, target: nodes[nodes_idx].id}) (edges)}
    return [graph_, R.length (nodes)]
  } else {
    /* Connect to existing */
    const {id} = nodes_sat[0]
    const idx = R.findIndex (R.propEq (`id`, id)) (nodes)

    // R.over
    const graph_ = {nodes: R.over (R.lensPath ([idx, `metadata`, `names`])) (R.union (names)) (nodes), edges: R.append ({source: id, target: nodes[nodes_idx].id}) (edges)}
    return [graph_, idx]
  }
},
handle_child = state => val => i => linesFromBase => {
  const [graph, nodes_idx, idx, ind, ind_next, children_idxs, children_node_idxs] = state
  const [ind_current, name] = val

  if (ind_current > ind) {
    // if (ind_current < ind_next) {
    //   throw new Error (`incorrect indentation at ${val}: ${ind_current}, ${ind_next}`)
    // } else if (ind_current > ind_next) {
    //   return state
    if (ind_current < ind_next) {
      throw new Error (`incorrect indentation at ${val}: ${ind_current}, ${ind_next}`)
    } else if (ind_current > ind_next) {
      return state
    } else {
      /* Conditionally add new node */
      const [graph_, child_node_idx] = createGraph (graph) (nodes_idx) (name)
      return [graph_, nodes_idx, idx, ind, ind_next, R.append (i) (children_idxs), R.append (child_node_idx) (children_node_idxs)]
    }
  }
  
  return state
},

/**
 * @description Takes a 2-element state, the line index and lines and returns the 
 */
handle_rec = state => (idx, lines) => {
  // lines[idx] |> console.log ('handleRecCall, lines[idx]', #)
  const [ind, name] = R.nth (idx) (lines)
  /* Has correct indentation */
  H.assert (ind % TAB === 0) (`indivisible indentation at ${idx}: ${name}`)
  /* Is not last node */
  if (idx === lines.length - 1 ) return state
  // R.nth (idx + 1) (lines) |> console.log ('R.nth (idx + 1) (lines)', #)
  const [ind_next] = R.nth (idx + 1) (lines)
  /* Is not leaf */
  if (ind_next <= ind) return state
  const end = R.findIndex (R.pipe (R.nth (0), R.gte (ind))) (R.slice (idx + 1) (Infinity) (lines))
  const end_edited = end === -1 ? lines.length : end
  // state[1] |> console.log ('state[1]', #)
  const state_ = H.superReduce (handle_child) ([state[0], state[1], idx, ind, ind_next, [], []]) (R.slice (idx + 1) (idx + 1 + end_edited) (lines))
  const children_idxs = R.map (R.add (idx + 1)) (state_[5])
  const children_node_idxs = state_[6]
  // const idx = R.findIndex (R.propEq (`id`, id)) (state_[0].nodes)
  return H.superReduce (acc => ([child, child_node_idx]) => i => _lines => handle_rec (R.update (1) (child_node_idx) (acc)) (child, lines)) (state_) (R.zip (children_idxs, children_node_idxs))
},

prepare = R.map (prepare_line),
handle = R.converge (handle_rec (baseCase)) ([R.always (0), R.identity]),

parse = R.pipe(
  H.lines,
  prepare,
  handle,
  R.nth (0),
  R.objOf (`graph`)
)

// const [graph_final] = parse (topics)

// const {nodes, edges} = graph_final

// R.map (console.log) (nodes)
// R.map (console.log) (edges)

export default parse

// for (let i = 0; i < arrOfLines.length; i++) {
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
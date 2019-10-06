import {R, H} from './common'

const topics = require (`@solviofoundation/amos-topics`)

const
// topics = `
// test
//     test
//     test
//   test
// `,

TAB = 2,

/* [graph, nodes idx, idx, current ind, next ind] */
baseCase = [{nodes: [{id:`Academic`, metadata: {names: [`Academic`]}}], edges: []}, 0],

prepare_line = R.juxt([
  R.pipe (R.match (/^\s*/g), R.nth (0), R.length),
  R.trim
]),


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
    // const id = H.toPascalCase(names[0])
    const node = {metadata: {names}}

    const graph_ = {nodes: R.append (node) (nodes), edges: R.append ({child: names[0], parent: nodes[nodes_idx].metadata.names[0]}) (edges)}
    return [graph_, R.length (nodes)]
  } else {
    /* Connect to existing */
    const {metadata: {names_sat}} = nodes_sat[0]
    const idx = R.findIndex (R.pipe (R.path ([`metadata`, `names`]), R.includes (names_sat[0]))) (nodes)

    // R.over
    const graph_ = {nodes: R.over (R.lensPath ([idx, `metadata`, `names`])) (R.union (names)) (nodes), edges: R.append ({child: names_sat[0], parent: nodes[nodes_idx].metadata.names[0]}) (edges)}
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

const {graph: graph_final} = parse (topics)

const {nodes, edges} = graph_final

R.map (console.log) (nodes)
R.map (console.log) (edges)

export default parse

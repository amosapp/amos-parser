"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _common = require("./common");function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {return;}var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}

var topics = require("@solviofoundation/amos-topics");

var
// topics = `
// test
//     test
//     test
//   test
// `,

TAB = 2,

/* [graph, nodes idx, idx, current ind, next ind] */
baseCase = [{ nodes: [{ id: "Academic", metadata: { names: ["Academic"] } }], edges: [] }, 0],

prepare_line = _common.R.juxt([
_common.R.pipe(_common.R.match(/^\s*/g), _common.R.nth(0), _common.R.length),
_common.R.trim]),



createGraph = function createGraph(graph) {return function (nodes_idx) {return function (name) {
      var names = _common.R.split(" / ")(name);var
      nodes = graph.nodes,edges = graph.edges;

      // const nodes = R.filter (R.pipe (R.path ([`metadata`, `names`]), R.includes (name))) (graph.nodes)
      // const nodes = R.innerJoin ((node, name) => R.pipe (R.path ([`metadata`, `names`]), R.includes (name))) (graph.nodes) (names)
      // const nodes = R.innerJoin (R.converge (R.includes, [R.nthArg (1), R.path ([`metadata`, `names`])])) (graph.nodes) (names)
      var nodes_sat = _common.R.innerJoin(
      _common.R.useWith(
      _common.R.flip(_common.H.includes),
      [_common.R.path(["metadata", "names"]), _common.R.identity]))(


      nodes)(
      names);

      _common.H.assert(_common.R.length(nodes_sat) <= 1)("problem at: ".concat(name));

      if (_common.R.isEmpty(nodes_sat)) {
        /* Add new node */
        // return addEdge (graph) (nodes_idx) (name)
        // const id = H.toPascalCase(names[0])
        var node = { metadata: { names: names } };

        var graph_ = { nodes: _common.R.append(node)(nodes), edges: _common.R.append({ child: names[0], parent: nodes[nodes_idx].metadata.names[0] })(edges) };
        return [graph_, _common.R.length(nodes)];
      } else {
        /* Connect to existing */var
        names_sat = nodes_sat[0].metadata.names;
        var idx = _common.R.findIndex(_common.R.pipe(_common.R.path(["metadata", "names"]), _common.R.includes(names_sat[0])))(nodes);

        // R.over
        var _graph_ = { nodes: _common.R.over(_common.R.lensPath([idx, "metadata", "names"]))(_common.R.union(names))(nodes), edges: _common.R.append({ child: names_sat[0], parent: nodes[nodes_idx].metadata.names[0] })(edges) };
        return [_graph_, idx];
      }
    };};},
handle_child = function handle_child(state) {return function (val) {return function (i) {return function (linesFromBase) {var _state = _slicedToArray(
        state, 7),graph = _state[0],nodes_idx = _state[1],idx = _state[2],ind = _state[3],ind_next = _state[4],children_idxs = _state[5],children_node_idxs = _state[6];var _val = _slicedToArray(
        val, 2),ind_current = _val[0],name = _val[1];

        if (ind_current > ind) {
          // if (ind_current < ind_next) {
          //   throw new Error (`incorrect indentation at ${val}: ${ind_current}, ${ind_next}`)
          // } else if (ind_current > ind_next) {
          //   return state
          if (ind_current < ind_next) {
            throw new Error("incorrect indentation at ".concat(val, ": ").concat(ind_current, ", ").concat(ind_next));
          } else if (ind_current > ind_next) {
            return state;
          } else {
            /* Conditionally add new node */var _createGraph =
            createGraph(graph)(nodes_idx)(name),_createGraph2 = _slicedToArray(_createGraph, 2),graph_ = _createGraph2[0],child_node_idx = _createGraph2[1];
            return [graph_, nodes_idx, idx, ind, ind_next, _common.R.append(i)(children_idxs), _common.R.append(child_node_idx)(children_node_idxs)];
          }
        }

        return state;
      };};};},

/**
                * @description Takes a 2-element state, the line index and lines and returns the 
                */
handle_rec = function handle_rec(state) {return function (idx, lines) {
    // lines[idx] |> console.log ('handleRecCall, lines[idx]', #)
    var _R$nth = _common.R.nth(idx)(lines),_R$nth2 = _slicedToArray(_R$nth, 2),ind = _R$nth2[0],name = _R$nth2[1];
    /* Has correct indentation */
    _common.H.assert(ind % TAB === 0)("indivisible indentation at ".concat(idx, ": ").concat(name));
    /* Is not last node */
    if (idx === lines.length - 1) return state;
    // R.nth (idx + 1) (lines) |> console.log ('R.nth (idx + 1) (lines)', #)
    var _R$nth3 = _common.R.nth(idx + 1)(lines),_R$nth4 = _slicedToArray(_R$nth3, 1),ind_next = _R$nth4[0];
    /* Is not leaf */
    if (ind_next <= ind) return state;
    var end = _common.R.findIndex(_common.R.pipe(_common.R.nth(0), _common.R.gte(ind)))(_common.R.slice(idx + 1)(Infinity)(lines));
    var end_edited = end === -1 ? lines.length : end;
    // state[1] |> console.log ('state[1]', #)
    var state_ = _common.H.superReduce(handle_child)([state[0], state[1], idx, ind, ind_next, [], []])(_common.R.slice(idx + 1)(idx + 1 + end_edited)(lines));
    var children_idxs = _common.R.map(_common.R.add(idx + 1))(state_[5]);
    var children_node_idxs = state_[6];
    // const idx = R.findIndex (R.propEq (`id`, id)) (state_[0].nodes)
    return _common.H.superReduce(function (acc) {return function (_ref) {var _ref2 = _slicedToArray(_ref, 2),child = _ref2[0],child_node_idx = _ref2[1];return function (i) {return function (_lines) {return handle_rec(_common.R.update(1)(child_node_idx)(acc))(child, lines);};};};})(state_)(_common.R.zip(children_idxs, children_node_idxs));
  };},

prepare = _common.R.map(prepare_line),
handle = _common.R.converge(handle_rec(baseCase))([_common.R.always(0), _common.R.identity]),

parse = _common.R.pipe(
_common.H.lines,
prepare,
handle,
_common.R.nth(0),
_common.R.objOf("graph"));


// const {graph: graph_final} = parse (topics)

// const {nodes, edges} = graph_final

// R.map (console.log) (nodes)
// R.map (console.log) (edges)
var _default =
parse;exports["default"] = _default;
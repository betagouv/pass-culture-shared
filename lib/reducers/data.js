'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.successData = exports.resetData = exports.requestData = exports.failData = exports.assignData = exports.data = undefined;

var _data = require('../utils/data');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ACTION
var ASSIGN_DATA = 'ASSIGN_DATA';
var RESET_DATA = 'RESET_DATA';

// INITIAL STATE
var initialState = {
  events: [],
  eventOccurences: [],
  mediations: [],
  occasions: [],
  offers: [],
  offerers: [],
  providers: [],
  things: [],
  types: [],
  venues: [],
  venueProviders: []

  // REDUCER
};var data = exports.data = function data() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (action.type === ASSIGN_DATA) {
    return Object.assign({}, state, action.patch);
  } else if (action.type === RESET_DATA) {
    return initialState;
  } else if (/SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type)) {
    // unpack config
    var key = action.config.key || action.path.replace(/\/$/, '').replace(/\?.*$/, '');

    // resolve
    var nextState = (0, _data.getNextState)(state, action.method, _defineProperty({}, key, !Array.isArray(action.data) ? [action.data] : action.data), action.config);

    // last
    if (action.config.getSuccessState) {
      Object.assign(nextState, action.config.getSuccessState(state, action));
    }

    // return
    return Object.assign({}, state, nextState);
  }
  return state;
};

// ACTION CREATORS
var assignData = exports.assignData = function assignData(patch) {
  return {
    patch: patch,
    type: ASSIGN_DATA
  };
};

var failData = exports.failData = function failData(method, path, errors, config) {
  return {
    config: config,
    errors: errors,
    method: method,
    path: path,
    type: 'FAIL_DATA_' + method.toUpperCase() + '_' + path.toUpperCase() + (config.local ? ' (LOCAL)' : '')
  };
};

var requestData = exports.requestData = function requestData(method, path) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    config: config,
    method: method,
    path: path,
    type: 'REQUEST_DATA_' + method.toUpperCase() + '_' + path.toUpperCase() + (config.local ? ' (LOCAL)' : '')
  };
};

var resetData = exports.resetData = function resetData() {
  return {
    type: RESET_DATA
  };
};

var successData = exports.successData = function successData(method, path, data) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return {
    config: config,
    data: data,
    method: method,
    path: path,
    type: 'SUCCESS_DATA_' + method.toUpperCase() + '_' + path.toUpperCase() + (config.local ? ' (LOCAL)' : '')
  };
};
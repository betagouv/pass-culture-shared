'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ACTIONS
var ASSIGN_ERRORS = 'ASSIGN_ERRORS';
var REMOVE_ERRORS = 'REMOVE_ERRORS';
var RESET_ERRORS = 'RESET_ERRRORS';

// INITIAL STATE
var initialState = {};

// REDUCER
var errors = exports.errors = function errors() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case ASSIGN_ERRORS:
      return Object.assign({}, state, action.patch);
    case REMOVE_ERRORS:
      return Object.assign({}, state, _defineProperty({}, action.name, null));
    case RESET_ERRORS:
      return initialState;
    default:
      return state;
  }
};

// ACTION CREATORS
var assignErrors = exports.assignErrors = function assignErrors(patch) {
  return {
    patch: patch,
    type: ASSIGN_ERRORS
  };
};

var removeErrors = exports.removeErrors = function removeErrors(name) {
  return {
    name: name,
    type: REMOVE_ERRORS
  };
};

var resetErrors = exports.resetErrors = function resetErrors() {
  return {
    type: RESET_ERRORS
  };
};
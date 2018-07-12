'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetForm = exports.removeForm = exports.mergeForm = exports.newErrorForm = exports.newMergeForm = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getFormCollection = getFormCollection;
exports.getFormEntity = getFormEntity;
exports.getFormValue = getFormValue;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _config = require('../utils/config');

var _object = require('../utils/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// INITIAL STATE
var initialState = {};

// ACTIONS
var MERGE_FORM = 'MERGE_FORM';
var NEW_MERGE_FORM = 'NEW_MERGE_FORM';
var REMOVE_FORM = 'REMOVE_FORM';
var RESET_FORM = 'RESET_FORM';
var NEW_ERROR_FORM = 'NEW_ERROR_FORM';

// REDUCER
var form = function form() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var collectionKey = action.collectionName + 'ById';
  var collection = Object.assign({}, state[collectionKey]);
  switch (action.type) {
    case NEW_MERGE_FORM:
      var newValue = Object.keys(action.values).reduce(function (result, k) {
        return (0, _lodash4.default)(result, k, action.values[k]);
      }, {});
      return (0, _object.deepMerge)(state, _defineProperty({}, action.name, {
        data: newValue
      }));
    case NEW_ERROR_FORM:
      console.log(action);
      return (0, _object.deepMerge)(state, _defineProperty({}, action.name, {
        errors: [].concat(action.values)
      }));
    case REMOVE_FORM:
      delete collection[action.id];
      return Object.assign({}, state, _defineProperty({}, collectionKey, collection));
    case MERGE_FORM:
      var entity = Object.assign({}, collection[action.id]);
      if (_typeof(action.nameOrObject) === 'object' && !action.value) {
        collection[action.id] = Object.assign({}, collection[action.id], action.nameOrObject);
      } else if (action.nameOrObject === _config.DELETE) {
        collection[action.id] = _config.DELETE;
      } else {
        collection[action.id] = entity;
        if (action.nameOrObject.includes('.')) {
          var chunks = action.nameOrObject.split('.');
          var chainKey = chunks.slice(0, -1).join('.');
          var lastKey = chunks.slice(-1)[0];
          var value = (0, _lodash2.default)(entity, chainKey);
          if (!value && !chainKey.includes('.')) {
            entity[chainKey] = action.parentValue;
          }
          value = entity[chainKey];
          if (value) {
            value[lastKey] = action.value;
          }
        } else {
          entity[action.nameOrObject] = action.value;
        }
      }
      return Object.assign({}, state, _defineProperty({}, collectionKey, collection));
    case RESET_FORM:
      return {};
    default:
      return state;
  }
};

// ACTION CREATORS
var newMergeForm = exports.newMergeForm = function newMergeForm(name, values, options) {
  return {
    type: NEW_MERGE_FORM,
    name: name,
    values: values,
    options: options
  };
};

var newErrorForm = exports.newErrorForm = function newErrorForm(name, values) {
  return {
    type: NEW_ERROR_FORM,
    name: name,
    values: values
  };
};

var mergeForm = exports.mergeForm = function mergeForm(collectionName, id, nameOrObject, value, parentValue) {
  return {
    collectionName: collectionName,
    id: id,
    nameOrObject: nameOrObject,
    type: MERGE_FORM,
    value: value,
    parentValue: parentValue
  };
};

var removeForm = exports.removeForm = function removeForm(collectionName, id) {
  return {
    collectionName: collectionName,
    id: id,
    type: REMOVE_FORM
  };
};

var resetForm = exports.resetForm = function resetForm(patch) {
  return { type: RESET_FORM };
};

// SELECTORS
function getFormCollection(state, ownProps) {
  var form = state.form;
  if (!form) {
    return;
  }
  return form[ownProps.collectionName + 'ById'];
}

function getFormEntity(state, ownProps) {
  var collection = getFormCollection(state, ownProps);
  if (!collection) {
    return;
  }
  return collection[ownProps.entityId || _config.NEW];
}

function getFormValue(state, ownProps) {
  var entity = getFormEntity(state, ownProps);
  if (!entity) {
    return;
  }
  return entity[ownProps.name];
}

// default
exports.default = form;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextState = getNextState;

var _lodash = require('lodash.uniqby');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getNextState(state, method, patch) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  // UNPACK
  var normalizer = config.normalizer,
      isMergingDatum = config.isMergingDatum,
      isMutatingDatum = config.isMutatingDatum;

  var isMergingArray = typeof config.isMergingArray === 'undefined' ? true : config.isMergingArray;
  var isMutatingArray = typeof config.isMutatingArray === 'undefined' ? true : config.isMutatingArray;
  var nextState = config.nextState || {};

  if (!patch) {
    return state;
  }

  // LOOP OVER ALL THE KEYS
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var key = _step.value;


      // PREVIOUS
      var previousData = state[key];

      // CLONE
      // FORCE TO GIVE AN ID
      // UNIFY BY ID
      // (BECAUSE DEEPEST NORMALIZED DATA CAN RETURN ARRAY OF SAME ELEMENTS)
      var data = patch[key];
      if (!data) {
        return 'continue';
      }
      var nextData = (0, _lodash2.default)(data.map(function (datum, index) {
        return Object.assign({ id: index }, datum);
      }), function (datum) {
        return datum.id;
      });

      // NORMALIZER
      if (normalizer) {
        Object.keys(normalizer).forEach(function (key) {

          var nextNormalizedData = [];
          nextData.forEach(function (nextDatum) {
            if (Array.isArray(nextDatum[key])) {
              nextNormalizedData = nextNormalizedData.concat(nextDatum[key]);
              // replace by an array of ids
              nextDatum[key + 'Ids'] = nextDatum[key].map(function (d) {
                return d.id;
              });
              // delete
              delete nextDatum[key];
            } else if (nextDatum[key]) {
              nextNormalizedData.push(nextDatum[key]);
              delete nextDatum[key];
            }
          });

          if (nextNormalizedData.length) {

            // ADAPT BECAUSE NORMALIZER VALUES
            // CAN BE DIRECTLY THE STORE KEYS IN THE STATE
            // OR AN OTHER CHILD NORMALIZER CONFIG
            // IN ORDER TO BE RECURSIVELY EXECUTED
            var nextNormalizer = void 0;
            var storeKey = void 0;
            if (typeof normalizer[key] === 'string') {
              storeKey = normalizer[key];
            } else {
              storeKey = normalizer[key].key;
              nextNormalizer = normalizer[key].normalizer;
            }

            // RECURSIVE CALL TO MERGE THE DEEPER NORMALIZED VALUE
            var nextNormalizedState = getNextState(state, null, _defineProperty({}, storeKey, nextNormalizedData), { nextState: nextState, normalizer: nextNormalizer });

            // MERGE THE CHILD NORMALIZED DATA INTO THE
            // CURRENT NEXT STATE
            Object.assign(nextState, nextNormalizedState);
          }
        });
      }

      // no need to go further if no previous data
      if (!previousData) {
        nextState[key] = nextData;
        return 'continue';
      }

      // DELETE CASE
      if (method === 'DELETE') {
        var nextDataIds = nextData.map(function (nextDatum) {
          return nextDatum.id;
        });
        var _resolvedData = previousData.filter(function (previousDatum) {
          return !nextDataIds.includes(previousDatum.id);
        });
        nextState[key] = _resolvedData;
        return 'continue';
      }

      // GET POST PATCH

      // no need to go further when we want just to trigger
      // a new fresh assign with nextData
      if (!isMergingArray) {
        nextState[key] = nextData;
        return 'continue';
      }

      // Determine first if we are going to trigger a mutation of the array
      var resolvedData = isMutatingArray ? [].concat(_toConsumableArray(previousData)) : previousData;

      // for each datum we are going to assign (by merging or not) them into
      // their right place in the resolved array
      nextData.forEach(function (nextDatum) {
        var previousIndex = previousData.findIndex(function (previousDatum) {
          return previousDatum.id === nextDatum.id;
        });
        var resolvedIndex = previousIndex === -1 ? resolvedData.length : previousIndex;
        var datum = isMutatingDatum ? Object.assign({}, isMergingDatum && previousData[previousIndex], nextDatum) : isMergingDatum ? previousIndex !== -1 ? Object.assign(previousData[previousIndex], nextDatum) : nextDatum : nextDatum;
        resolvedData[resolvedIndex] = datum;
      });

      // set
      nextState[key] = resolvedData;
    };

    for (var _iterator = Object.keys(patch)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if (_ret === 'continue') continue;
    }

    // return
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return nextState;
}
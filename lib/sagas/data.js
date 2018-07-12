'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchDataActions = watchDataActions;

var _effects = require('redux-saga/effects');

var _data = require('../reducers/data');

var _form = require('../reducers/form');

var _errors = require('../reducers/errors');

var _request = require('../utils/request');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(fromWatchRequestDataActions),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(fromWatchFailDataActions),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(fromWatchSuccessDataActions),
    _marked4 = /*#__PURE__*/regeneratorRuntime.mark(watchDataActions);

function fromWatchRequestDataActions(action) {
  var method, path, config, _ref, body, encode, formName, type, token, result;

  return regeneratorRuntime.wrap(function fromWatchRequestDataActions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // UNPACK
          method = action.method, path = action.path, config = action.config;
          _ref = config || {}, body = _ref.body, encode = _ref.encode, formName = _ref.formName, type = _ref.type;

          // TOKEN

          _context.next = 4;
          return type && (0, _effects.select)(function (state) {
            return state.data[type + 'Token'];
          });

        case 4:
          token = _context.sent;
          _context.prev = 5;
          _context.next = 8;
          return (0, _effects.call)(_request.fetchData, method, path, { body: body, encode: encode, token: token });

        case 8:
          result = _context.sent;

          if (!result.data) {
            _context.next = 14;
            break;
          }

          _context.next = 12;
          return (0, _effects.put)((0, _data.successData)(method, path, result.data, config));

        case 12:
          _context.next = 20;
          break;

        case 14:
          if (!formName) {
            _context.next = 17;
            break;
          }

          _context.next = 17;
          return (0, _effects.put)((0, _form.newErrorForm)(formName, result.errors));

        case 17:
          console.error(result.errors);
          _context.next = 20;
          return (0, _effects.put)((0, _data.failData)(method, path, result.errors, config));

        case 20:
          _context.next = 27;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context['catch'](5);

          console.error('error', _context.t0);
          _context.next = 27;
          return (0, _effects.put)((0, _data.failData)(method, path, [{
            //global: String(error)
            global: "Erreur serveur. Tentez de rafraîchir la page."
          }], config));

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[5, 22]]);
}

function fromWatchFailDataActions(action) {
  var errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, error, state;

  return regeneratorRuntime.wrap(function fromWatchFailDataActions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = [].concat(action.errors);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 4;
          _iterator = errors[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 13;
            break;
          }

          error = _step.value;
          _context2.next = 10;
          return (0, _effects.put)((0, _errors.assignErrors)(error));

        case 10:
          _iteratorNormalCompletion = true;
          _context2.next = 6;
          break;

        case 13:
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2['catch'](4);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 19:
          _context2.prev = 19;
          _context2.prev = 20;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 22:
          _context2.prev = 22;

          if (!_didIteratorError) {
            _context2.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return _context2.finish(22);

        case 26:
          return _context2.finish(19);

        case 27:
          if (!action.config.handleFail) {
            _context2.next = 33;
            break;
          }

          _context2.next = 30;
          return (0, _effects.select)(function (state) {
            return state;
          });

        case 30:
          state = _context2.sent;
          _context2.next = 33;
          return (0, _effects.call)(action.config.handleFail, state, action);

        case 33:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this, [[4, 15, 19, 27], [20,, 22, 26]]);
}

function fromWatchSuccessDataActions(action) {
  var state;
  return regeneratorRuntime.wrap(function fromWatchSuccessDataActions$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!action.config.handleSuccess) {
            _context3.next = 6;
            break;
          }

          _context3.next = 3;
          return (0, _effects.select)(function (state) {
            return state;
          });

        case 3:
          state = _context3.sent;
          _context3.next = 6;
          return (0, _effects.call)(action.config.handleSuccess, state, action);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

function watchDataActions() {
  return regeneratorRuntime.wrap(function watchDataActions$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeEvery)(function (_ref2) {
            var type = _ref2.type;
            return (/REQUEST_DATA_(.*)/.test(type)
            );
          }, fromWatchRequestDataActions);

        case 2:
          _context4.next = 4;
          return (0, _effects.takeEvery)(function (_ref3) {
            var type = _ref3.type;
            return (/FAIL_DATA_(.*)/.test(type)
            );
          }, fromWatchFailDataActions);

        case 4:
          _context4.next = 6;
          return (0, _effects.takeEvery)(function (_ref4) {
            var type = _ref4.type;
            return (/SUCCESS_DATA_(.*)/.test(type)
            );
          }, fromWatchSuccessDataActions);

        case 6:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}
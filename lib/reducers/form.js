'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchFormActions = watchFormActions;

var _effects = require('redux-saga/effects');

var _form = require('../reducers/form');

var _errors = require('../reducers/errors');

var _string = require('../utils/string');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(watchFormActions);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SIRET = 'siret';
var SIREN = 'siren';

var fromWatchSirenInput = function fromWatchSirenInput(sireType) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _callee(action) {
      var values, response, body, dataPath;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              values = action.values;
              _context.prev = 1;
              _context.next = 4;
              return (0, _effects.call)(fetch, 'https://sirene.entreprise.api.gouv.fr/v1/' + sireType + '/' + values[sireType]);

            case 4:
              response = _context.sent;

              if (!(response.status === 404)) {
                _context.next = 12;
                break;
              }

              _context.next = 8;
              return (0, _effects.put)((0, _errors.assignErrors)(_defineProperty({}, sireType, [(0, _string.capitalize)(sireType) + ' invalide'])));

            case 8:
              _context.next = 10;
              return (0, _effects.put)((0, _form.newMergeForm)(action.name, _defineProperty({
                address: null,
                city: null,
                latitude: null,
                longitude: null,
                name: null,
                postalCode: null
              }, sireType, null)));

            case 10:
              _context.next = 18;
              break;

            case 12:
              _context.next = 14;
              return (0, _effects.call)([response, 'json']);

            case 14:
              body = _context.sent;
              dataPath = sireType === SIREN ? 'siege_social' : 'etablissement';
              _context.next = 18;
              return (0, _effects.put)((0, _form.newMergeForm)(action.name, _defineProperty({
                address: (0, _lodash2.default)(body, dataPath + '.geo_adresse'),
                city: (0, _lodash2.default)(body, dataPath + '.libelle_commune'),
                latitude: (0, _lodash2.default)(body, dataPath + '.latitude'),
                longitude: (0, _lodash2.default)(body, dataPath + '.longitude'),
                name: (0, _lodash2.default)(body, dataPath + '.l1_normalisee') || (0, _lodash2.default)(body, dataPath + '.l1_declaree') || '',
                postalCode: (0, _lodash2.default)(body, dataPath + '.code_postal')
              }, sireType, (0, _lodash2.default)(body, dataPath + '.' + sireType)), {
                calledFromSaga: true // Prevent infinite loop
              }));

            case 18:
              _context.next = 25;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context['catch'](1);

              console.error(_context.t0);
              _context.next = 25;
              return (0, _effects.put)((0, _errors.assignErrors)(_defineProperty({}, sireType, ['Impossible de v\xE9rifier le ' + (0, _string.capitalize)(sireType) + ' saisi.'])));

            case 25:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 20]]);
    })
  );
};

function watchFormActions() {
  return regeneratorRuntime.wrap(function watchFormActions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeEvery)(function (_ref) {
            var type = _ref.type,
                values = _ref.values,
                options = _ref.options;

            var result = type === 'NEW_MERGE_FORM' && !(0, _lodash2.default)(options, 'calledFromSaga') && (0, _lodash2.default)(values, SIREN + '.length') === 9;
            return result;
          }, fromWatchSirenInput(SIREN));

        case 2:
          _context2.next = 4;
          return (0, _effects.takeEvery)(function (_ref2) {
            var type = _ref2.type,
                values = _ref2.values,
                options = _ref2.options;

            return type === 'NEW_MERGE_FORM' && !(0, _lodash2.default)(options, 'calledFromSaga') && (0, _lodash2.default)(values, SIRET + '.length') === 14;
          }, fromWatchSirenInput(SIRET));

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked, this);
}
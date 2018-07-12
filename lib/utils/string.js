'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.capitalize = capitalize;
exports.removeWhitespaces = removeWhitespaces;
exports.pluralize = pluralize;
exports.queryStringToObject = queryStringToObject;
exports.objectToQueryString = objectToQueryString;
exports.updateQueryString = updateQueryString;
exports.formatSiren = formatSiren;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function capitalize() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return string ? '' + string[0].toUpperCase() + string.slice(1) : string;
}

function removeWhitespaces(string) {
  return string && string.trim().replace(/\s/g, '');
}

function pluralizeWord(string, number) {
  var pluralizeWith = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 's';

  var singular = void 0,
      plural = void 0;
  var lastLetter = string.slice(-1)[0];
  if (lastLetter === 's' || lastLetter === 'x') {
    singular = string.slice(0, -1);
    plural = string;
  } else {
    singular = string;
    plural = '' + string + pluralizeWith;
  }
  return number > 1 ? plural : singular;
}

function pluralizeString(string, number, pluralizeWith) {
  return string.split(' ').map(function (w) {
    return pluralizeWord(w, number, pluralizeWith);
  }).join(' ');
}

function pluralize(number, string, pluralizeWith) {
  if (typeof number === 'string' && typeof string === 'number') {
    // arguments are in the other way round, don't write number
    return pluralizeString(number, string, pluralizeWith);
  }
  return number + ' ' + pluralizeString(string, number, pluralizeWith);
}

function queryStringToObject() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return string.replace(/^\??/, '').split('&').filter(function (el) {
    return el;
  }).reduce(function (result, group) {
    var _group$split = group.split('='),
        _group$split2 = _slicedToArray(_group$split, 2),
        key = _group$split2[0],
        value = _group$split2[1];

    switch (key) {
      case 'lieu':
        key = 'venueId';
        break;
      case 'structure':
        key = 'offererId';
        break;
      default:
        break;
    }
    return Object.assign({}, result, _defineProperty({}, key, value));
  }, {});
}

function objectToQueryString() {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return object && Object.keys(object).filter(function (k) {
    return k && object[k];
  }).map(function (key) {
    var value = String(object[key]);
    return value && key + '=' + value;
  }).filter(function (arg) {
    return arg;
  }).join('&');
}

function updateQueryString(string, object) {
  var previousObject = queryStringToObject(object);
  var nextObject = Object.assign({}, previousObject, object);
  return objectToQueryString(nextObject);
}

function formatSiren(string) {
  var value = removeWhitespaces(string);
  if (!value) {
    return '';
  }
  var siren = value.substring(0, 9);
  var nic = value.substring(9);
  var formattedSiren = (siren.match(/.{1,3}/g) || []).join(' ');
  return (formattedSiren + ' ' + nic).trim();
}
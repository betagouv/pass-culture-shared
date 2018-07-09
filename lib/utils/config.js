'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROOT_PATH = exports.IS_LOCALHOST = exports.MOBILE_OS = exports.THUMBS_URL = exports.API_URL = exports.SPACE = exports.SEARCH = exports.NEW = exports.DELETE = exports.AND = exports.IS_PROD = exports.IS_DEV = exports.IS_DEBUG = undefined;
exports.apiUrl = apiUrl;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment/locale/fr');

require('moment-timezone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_moment2.default.locale('fr-fr');

var NODE_ENV = process.env.NODE_ENV;
var IS_DEBUG = exports.IS_DEBUG = true;

var IS_DEV = exports.IS_DEV = NODE_ENV === 'development';
var IS_PROD = exports.IS_PROD = !IS_DEV;

var AND = exports.AND = '_and_';
var DELETE = exports.DELETE = '_delete_';
var NEW = exports.NEW = '_new_';
var SEARCH = exports.SEARCH = '_search_';
var SPACE = exports.SPACE = ' ';

var CALCULATED_API_URL;
if (window.cordova) {
  CALCULATED_API_URL = 'https://api.passculture.beta.gouv.fr'; // This will be replaced by 'yarn pgbuild' for staging
} else {
  CALCULATED_API_URL = IS_DEV ? 'http://localhost' : 'https://' + document.location.host.replace('pro', 'api');
}
var API_URL = exports.API_URL = CALCULATED_API_URL;

var THUMBS_URL = exports.THUMBS_URL = IS_DEV ? API_URL + '/storage/thumbs' : API_URL + '/storage/thumbs';

function apiUrl(path) {
  if (!path) return;
  return '' + API_URL + path;
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'windows_phone';
  }

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  return 'unknown';
}

var MOBILE_OS = exports.MOBILE_OS = getMobileOperatingSystem();

var IS_LOCALHOST = exports.IS_LOCALHOST = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

var CALC_ROOT_PATH = '';
if (window.cordova) {
  document.body.className += ' cordova';
  if (MOBILE_OS === 'android') {
    CALC_ROOT_PATH = 'file:///android_asset/www';
    document.body.className += ' cordova-android';
    //document.body.className += ' android-with-statusbar'
  } else if (MOBILE_OS === 'ios') {
    //TODO
    document.body.className += ' cordova-ios';
    // CALC_ROOT_PATH = window.location.href.split('/').slice(0, 10).join('/')
    CALC_ROOT_PATH = window.location.href.match(/file:\/\/(.*)\/www/)[0];
  }
  window.addEventListener('keyboardWillShow', function (e) {
    console.log('Keyboard show');
    document.body.className += ' softkeyboard';
  });
  window.addEventListener('keyboardWillHide', function (e) {
    console.log('Keyboard Hide');
    document.body.className = document.body.className.split(' ').filter(function (c) {
      return c !== 'softkeyboard';
    }).join(' ');
  });
} else {
  document.body.className += ' web';
  CALC_ROOT_PATH = window.location.protocol + '//' + document.location.host;
}

var ROOT_PATH = exports.ROOT_PATH = CALC_ROOT_PATH;
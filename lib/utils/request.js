'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = undefined;

var fetchData = exports.fetchData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(method, path) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var body, encode, token, init, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // unpack
            body = config.body, encode = config.encode, token = config.token;

            // init

            init = {
              method: method,
              credentials: 'include'
            };


            init.headers = {
              'AppVersion': version,
              'X-Request-ID': (0, _uuid2.default)()
            };

            if (method && method !== 'GET' && method !== 'DELETE') {

              // encode
              if (encode !== 'multipart/form-data') {
                Object.assign(init.headers, {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                });
              }

              // body
              init.body = init.headers['Content-Type'] === 'application/json' ? JSON.stringify(body || {}) : body;
            }

            // token
            if (token) {
              if (!init.headers) {
                init.headers = {};
              }
              init.headers.Authorization = 'Bearer ' + token;
            }

            // fetch
            _context.next = 7;
            return fetch(_config.API_URL + '/' + path, init);

          case 7:
            result = _context.sent;

            if (!success_status_codes.includes(result.status)) {
              _context.next = 16;
              break;
            }

            if (window.cordova) {
              window.cordova.plugins.CookieManagementPlugin.flush();
            }
            _context.next = 12;
            return result.json();

          case 12:
            _context.t0 = _context.sent;
            return _context.abrupt('return', {
              data: _context.t0
            });

          case 16:
            _context.next = 18;
            return result.json();

          case 18:
            _context.t1 = _context.sent;
            return _context.abrupt('return', {
              errors: _context.t1
            });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var version = process.env.version;


var success_status_codes = [200, 201, 202, 203, 205, 206, 207, 208, 210, 226];
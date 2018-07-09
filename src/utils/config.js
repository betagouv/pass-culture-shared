import moment from 'moment'
import 'moment/locale/fr'
import 'moment-timezone'

moment.locale('fr-fr')

const { NODE_ENV } = process.env

export const IS_DEBUG = true

export const IS_DEV = NODE_ENV === 'development'
export const IS_PROD = !IS_DEV

export const AND = '_and_'
export const DELETE = '_delete_'
export const NEW = '_new_'
export const SEARCH = '_search_'
export const SPACE = ' '

var CALCULATED_API_URL
if (window.cordova) {
  CALCULATED_API_URL = 'https://api.passculture.beta.gouv.fr' // This will be replaced by 'yarn pgbuild' for staging
} else {
  CALCULATED_API_URL = IS_DEV
    ? 'http://localhost'
    : 'https://' + document.location.host.replace('pro', 'api')
}
export const API_URL = CALCULATED_API_URL

export const THUMBS_URL = IS_DEV
  ? `${API_URL}/storage/thumbs`
  : `${API_URL}/storage/thumbs`

export function apiUrl(path) {
  if (!path) return
  return `${API_URL}${path}`
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'windows_phone'
  }

  if (/android/i.test(userAgent)) {
    return 'android'
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios'
  }

  return 'unknown'
}

export const MOBILE_OS = getMobileOperatingSystem()

export const IS_LOCALHOST = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

var CALC_ROOT_PATH = ''
if (window.cordova) {
  document.body.className += ' cordova'
  if (MOBILE_OS === 'android') {
    CALC_ROOT_PATH = 'file:///android_asset/www'
    document.body.className += ' cordova-android'
    //document.body.className += ' android-with-statusbar'
  } else if (MOBILE_OS === 'ios') {
    //TODO
    document.body.className += ' cordova-ios'
    // CALC_ROOT_PATH = window.location.href.split('/').slice(0, 10).join('/')
    CALC_ROOT_PATH = window.location.href.match(/file:\/\/(.*)\/www/)[0]
  }
  window.addEventListener('keyboardWillShow', function(e) {
    console.log('Keyboard show')
    document.body.className += ' softkeyboard'
  })
  window.addEventListener('keyboardWillHide', function(e) {
    console.log('Keyboard Hide')
    document.body.className = document.body.className
      .split(' ')
      .filter(c => c !== 'softkeyboard')
      .join(' ')
  })
} else {
  document.body.className += ' web'
  CALC_ROOT_PATH = window.location.protocol + '//' + document.location.host
}

export const ROOT_PATH = CALC_ROOT_PATH

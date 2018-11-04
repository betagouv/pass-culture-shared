function getMobileOperatingSystem() {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
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
}
export const MOBILE_OS = getMobileOperatingSystem()

let calculatedLocalhost
if (typeof window !== 'undefined') {
  calculatedLocalhost =
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
}
export const IS_LOCALHOST = Boolean(calculatedLocalhost)

let CALC_ROOT_PATH = ''
if (typeof window !== 'undefined' && window.cordova) {
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
  if (typeof window !== 'undefined') {
    document.body.className += ' web'
    CALC_ROOT_PATH = window.location.protocol + '//' + document.location.host
  }
}
export const ROOT_PATH = CALC_ROOT_PATH || 'http://localhost:3001/'

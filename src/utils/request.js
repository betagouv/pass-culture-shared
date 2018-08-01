import uuid from 'uuid'

const { NAME, VERSION } = process.env

const success_status_codes = [200, 201, 202, 203, 205, 206, 207, 208, 210, 226]

export async function fetchData(method, path, config = {}) {
  // unpack
  const { body, encode, token, url } = config

  // init
  const init = {
    method,
    credentials: 'include',
  }

  init.headers = {
    AppName: NAME,
    AppVersion: VERSION,
    'X-Request-ID': uuid(),
  }

  if (method && method !== 'GET' && method !== 'DELETE') {
    // encode
    if (encode !== 'multipart/form-data') {
      Object.assign(init.headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    // body
    init.body =
      init.headers['Content-Type'] === 'application/json'
        ? JSON.stringify(body || {})
        : body
  }

  // token
  if (token) {
    if (!init.headers) {
      init.headers = {}
    }
    init.headers.Authorization = `Bearer ${token}`
  }

  // fetch
  const result = await fetch(`${url}/${path.replace(/^\//, '')}`, init)

  // check
  if (success_status_codes.includes(result.status)) {
    if (window.cordova) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    }
    return { data: await result.json() }
  }
  return { errors: await result.json() }
}

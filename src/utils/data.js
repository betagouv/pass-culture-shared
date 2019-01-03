import uniqBy from 'lodash.uniqby'
import uuid from 'uuid'

const { NAME, VERSION } = process.env

const successStatusCodes = [200, 201, 202, 203, 205, 206, 207, 208, 210, 226]

export async function fetchData(method, path, config = {}) {
  const {
    body,
    token,
    url
  } = config

  const init = {
    credentials: 'include',
    method,
  }

  init.headers = {
    AppName: NAME,
    AppVersion: VERSION,
    'X-Request-ID': uuid(),
  }

  if (method && method !== 'GET' && method !== 'DELETE') {
    let formatBody = body
    let isFormDataBody = formatBody instanceof FormData
    if (formatBody && !isFormDataBody) {
      const fileValue = Object.values(body).find(value => value instanceof File)
      if (fileValue) {
        const formData = new FormData()
        Object.keys(formatBody).forEach(key => formData.append(key, formatBody[key]))
        formatBody = formData

        isFormDataBody = true
      }
    }

    if (!isFormDataBody) {
      Object.assign(init.headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

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
  const fetchUrl = `${url}/${path.replace(/^\//, '')}`
  const fetchResult = await fetch(fetchUrl, init)

  // prepare result
  const { ok, status } = fetchResult
  const result = {
    ok,
    status,
  }

  // check
  if (successStatusCodes.includes(status)) {
    // TODO: do we need that here precisely ?
    if (window.cordova) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    }

    // warn
    if (!fetchResult.json) {
      console.warn(
        `fetch is a success but expected a json format for the fetchResult of ${fetchUrl}`
      )
      result.errors = [
        {
          global: ['Le serveur ne renvoit pas de la donnée au bon format'],
        },
      ]
      return result
    }

    // success with data
    result.data = await fetchResult.json()
    return result
  }

  // special 204
  if (status === 204) {
    result.data = {}
    return result
  }

  // warn
  if (!fetchResult.json) {
    console.warn(
      `fetch returns ${status} but we still expected a json format for the fetchResult of ${fetchUrl}`
    )
    result.errors = [
      {
        global: ['Le serveur ne renvoit pas de la donnée au bon format'],
      },
    ]
    return result
  }

  // fail with errors
  result.errors = await fetchResult.json()
  return result
}


function getDefaultDatumIdValue (datum, index) {
  return datum.id || index
}

function getDefaultDatumIdKey () {
  return 'id'
}

export function getNextState(state, method, patch, config = {}) {
  // UNPACK
  const { normalizer, isMergingDatum, isMutatingDatum } = config
  const getDatumIdKey = config.getDatumIdKey || getDefaultDatumIdKey
  const getDatumIdValue = config.getDatumIdValue || getDefaultDatumIdValue
  const isMergingArray =
    typeof config.isMergingArray === 'undefined' ? true : config.isMergingArray
  const isMutatingArray =
    typeof config.isMutatingArray === 'undefined'
      ? true
      : config.isMutatingArray
  const nextState = config.nextState || {}

  if (!patch) {
    return state
  }

  Object.keys(patch).forEach(patchKey => {
    // PREVIOUS
    const previousData = state[patchKey]

    // TREAT
    const data = patch[patchKey]
    if (!data) {
      return
    }

    const nextData = uniqBy(
      data.map((datum, index) => {
        // CLONE
        let nextDatum = Object.assign(
          // FORCE TO GIVE AN ID
          { [getDatumIdKey(datum)]: getDatumIdValue(datum, index) },
          datum
        )

        // MAYBE RESOLVE
        if (config.resolve) {
          nextDatum = config.resolve(nextDatum, data, config)
        }

        return nextDatum
      }),
      // UNIFY BY ID
      // (BECAUSE DEEPEST NORMALIZED DATA CAN RETURN ARRAY OF SAME ELEMENTS)
      getDatumIdValue
    )

    // NORMALIZER
    if (normalizer) {
      Object.keys(normalizer).forEach(normalizerKey => {
        let nextNormalizedData = []
        nextData.forEach(nextDatum => {
          if (Array.isArray(nextDatum[normalizerKey])) {
            nextNormalizedData = nextNormalizedData.concat(nextDatum[normalizerKey])
            // replace by an array of ids
            nextDatum[`${normalizerKey}Ids`] = nextDatum[normalizerKey]
              .map(getDatumIdValue)
            // delete
            delete nextDatum[normalizerKey]
          } else if (nextDatum[normalizerKey]) {
            nextNormalizedData.push(nextDatum[normalizerKey])
            delete nextDatum[normalizerKey]
          }
        })

        if (nextNormalizedData.length) {
          // ADAPT BECAUSE NORMALIZER VALUES
          // CAN BE DIRECTLY THE STORE KEYS IN THE STATE
          // OR AN OTHER CHILD NORMALIZER CONFIG
          // IN ORDER TO BE RECURSIVELY EXECUTED
          let nextNormalizer
          let storeKey
          if (typeof normalizer[normalizerKey] === 'string') {
            storeKey = normalizer[normalizerKey]
          } else {
            storeKey = normalizer[normalizerKey].key
            nextNormalizer = normalizer[normalizerKey].normalizer
          }

          // RECURSIVE CALL TO MERGE THE DEEPER NORMALIZED VALUE
          const nextNormalizedState = getNextState(
            state,
            null,
            { [storeKey]: nextNormalizedData },
            {
              isMergingDatum:
                typeof normalizer[normalizerKey].isMergingDatum !== 'undefined'
                  ? normalizer[normalizerKey].isMergingDatum
                  : isMergingDatum,
              isMutatingDatum:
                typeof normalizer[normalizerKey].isMutatingDatum !== 'undefined'
                  ? normalizer[normalizerKey].isMutatingDatum
                  : isMutatingDatum,
              nextState,
              normalizer: nextNormalizer
            }
          )

          // MERGE THE CHILD NORMALIZED DATA INTO THE
          // CURRENT NEXT STATE
          Object.assign(nextState, nextNormalizedState)
        }
      })
    }

    // no need to go further if no previous data
    if (!previousData) {
      nextState[patchKey] = nextData
      return
    }

    // DELETE CASE
    if (method === 'DELETE') {
      const nextDataIds = nextData.map(getDatumIdValue)
      const resolvedData = previousData.filter(
        previousDatum => !nextDataIds.includes(getDatumIdValue(previousDatum))
      )
      nextState[patchKey] = resolvedData
      return
    }

    // GET POST PATCH

    // no need to go further when we want just to trigger
    // a new fresh assign with nextData
    if (!isMergingArray) {
      nextState[patchKey] = nextData
      return
    }

    // Determine first if we are going to trigger a mutation of the array
    const resolvedData = isMutatingArray ? [...previousData] : previousData

    // for each datum we are going to assign (by merging or not) them into
    // their right place in the resolved array
    nextData.forEach(nextDatum => {
      const previousIndex = previousData.findIndex(
        previousDatum => getDatumIdValue(previousDatum) === getDatumIdValue(nextDatum)
      )
      const resolvedIndex =
        previousIndex === -1 ? resolvedData.length : previousIndex

      let datum
      if (isMutatingDatum) {
        datum = Object.assign(
            {},
            isMergingDatum && previousData[previousIndex],
            nextDatum
          )
      } else if (isMergingDatum) {
        datum = previousIndex !== -1
          ? Object.assign(previousData[previousIndex], nextDatum)
          : nextDatum
      } else {
        datum = nextDatum
      }
      resolvedData[resolvedIndex] = datum
    })

    // set
    nextState[patchKey] = resolvedData
  })

  // return
  return nextState
}

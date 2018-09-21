# pass-culture-shared
Tous les objets javascript partagés entre l'application découverte et l'application pro

(See also https://legacy.gitbook.com/book/erwan_ledoux/pass-culture-shared/details in construction)
## Documentation

### Data

All about requestData, successData, failData...

#### Install

In your rootReducer in reducers/index.js:

```javascript
import { createData } from 'pass-culture-shared'
import { combineReducers } from 'redux'

const data = createData({
  // all your initial entities state in array shapes
  ...
  channels: [],
})

const rootReducer = combineReducers({
  data,
  ...
})

export default rootReducer
```

And in your rootSaga in sagas/index.js:

```javascript
import { watchDataActions } from 'pass-culture-shared'
import { all } from 'redux-saga/effects'

// API_URL typically like https://backend.myapp.org
// and usually your entities endpoint will have the shape
// of GET https://backend.myapp.org/channels
import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions({ url: API_URL }),
    ...
  ])
}

export default rootSaga
```

#### Hello example with handleSuccess and handleFail

requestData is an action creator helping for requesting data from the backend,
proposing "promises like" functions to be specified at success or error times of the api return.

Imagine a simple component used for fetching infos on youtube channel entities:

```javascript
import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import { connect } from 'redux'

class ChannelsPage extends Component {

  constructor () {
    super()
    this.state = {
      globalError: null,
      channels: []
      channelsError: null
    }
  }

  componentDidMount() {
      // you need to pass
      // method: 'GET', 'POST', 'PATCH', 'PUT' or 'DELETE'
      // path: the route api path to request data (with or without the first trailing slash)
      // config (optional): some config parameters explained later
      this.props.dispatch(requestData('GET', 'channels', {
        // handleSuccess is the "promised" callback function you can use
        // to do things on the success of the request
        // state: the global redux state (if you need it)
        // action: the action associated to SUCCESS_DATA_VENUES giving the data
        handleSuccess: (state, action) => this.setState({ channels: action.data })
        // ... or you can do things on fail
        // you can notably grab backend errors info
        // in action.errors.<key>[array of error string lines]
        handleFail: (state, action) => this.setState({
          // when action returns an error stored in the
          // 'global' key, it means a 500 error
          // except if the backend specially set this
          // error key for saying something else
          globalError: get(action, 'errors.global.0'),
          // when action returns an error with the same key as the pass
          // it means most of the time that the api handled a 400 like error
          channelsError: get(action, 'errors.channels.0')
        })
      }))
  }

  render () {
    const {
      globalError,
      channels,
      channelsError,
    } = this.state

    if (channelsError) {
      return (
        <div className="is-warning">
          {/* something like 'You are not authorized to fetch channels' */}
          {channelsError}
        </div>
      )
    }

    if (globalError) {
      return (
        <div className="is-danger">
        {/* something like 'Connection to the server has failed' */}
          {globalError}
        </div>
      )
    }

    return (
      <div>
        {channels.map(({ id, name }) => <p key={id}> {name} </p>)}
      </div>
    )
  }
}

// NOTE: it is important to connect to pass
// the dispatch function to the props
export default connect()(ChannelsPage)
```

#### Use the redux-reselect pattern when modularity is needed

Suppose you want several refined list of channels, ie instead of rendering all the channels:

```javascript
  return (
    <Fragment>
      <SubscribedChannels />
      <MostPopularChannels />
      <MarxLoversChannels />
      {...}
    </Fragment>
  )
```

You may first loose energy at passing the this.state.channels to all the children <SomethingChannels /> elements.

You would need also to think at the good place to implement your filters
on isSubscribed and rank, etc... in order to call them only
when it is needed.

That is when the redux-reselect pattern is used in our framework.
Such <SubscribedChannels /> will be in this workflow written like this:

```javascript
import React from 'react'
import { createSelector } from 'reselect'

const SubscribedChannels = ({ subscribedChannels }) => (
  <div>
    <p> subscriptions: </p>
    {
      subscribedChannels.map(({ id, name }) => (
        <p key={id}>
          {name}
        </p>
      ))
    }
  </div>
)

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => channels.filter(channel => channel.isSubscribed > 10)
)

export default connect(
  state => ({ subscribedChannels: selectSubscribedChannels(state) })
)(SubscribedChannels)
```

For summary,

requestData will feed the redux store, making your entities usually available at state.data.<collectionName>, like state.data.channels at successData Action time.
(triggered by saga listening to the requestData action when api payloads returns a success)

Also it will feed the redux store from api errors, at state.errors.<collectionName>, like state.errors.channels at failData Action time.
(triggered by saga listening to the requestData action when api payloads returns an error)

#### Dealing with nested payloads

1. Only REST fetch approach

From the backend channels payload comes with attached videos.
Without doing anything, action.data and state.data.channels will be like a
nested array of
```
[
  {
      id: "AXYU",
      name: "Bellevilloise mon amour",
      videos: [
        {
          channelId: "AXYU",
          id: "CER1",
          isFavorite: true,
          name: "PNL chante Marx",
          publishedDatetime: '2018-09-21 20:00:00'
        },
        {
          channelId: "AXYU",
          id: "UIZOS",
          isFavorite: false,
          name: "Franck Lepage rencontre Squeezie",
          publishedDatetime: '2018-09-22 21:00:00'
        },
        ...
      ]
  },
  {
      id: "ERUIO",
      name: "La buvette de la Rochecorbon",
      videos: [
        {
          channelId: "ERUIO",
          id: "MPSIE",
          isFavorite: false,
          name: "Grolinette mon amour",
          publishedDatetime: '2018-09-23 21:00:00',
        },
        ...
      ]
  },
  ...
]
```

For each video, we can say if it is a favorite one, and it would be cool
if each channel item could reflect their specific aggregated number of favorites.

Handling a 'naive' sync between the channels and the nested videos could be done like this:

```javascript
import flatten from 'lodash.flatten'
import React from 'react'
import { createSelector } from 'reselect'

const SubscribedChannels = ({ lastSubscribedVideos, subscribedChannels }) => (
  <div>
    <p> Subscriptions: </p>
    {
      subscribedChannels.map(({ id, favoritesCount, name}) => (
        <p key={id}>
          {name}
          {' '}
          {favoritesCount} favorites videos
        </p>
      ))
    }
    <p> Last Videos! </p>
    {
      lastSubscribedVideos.map({ id, isFavorite, name }) => (
        <p key={id}>
          {name} {' '} {isFavorite && '*'}
        </p>
      ))
    }
  </div>
)

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => {
    let subscribedChannels = channels.filter(channel => channel.isSubscribed)

    subscribedChannels = subscribedChannels.map(channel =>
      // Note that we pay attention to not mutate the
      // object value stored in the reducer
      Object.assign(
        {
          favoritesCount: channel.videos.filter(video => video.isFavorite)
                                        .length
        },
        channel
      )
    )

    return subscribedChannels

  }
)

const selectLastSubscribedVideos = createSelector(
  selectSubscribedChannels,
  subscribedChannels => flatten(
    subscribedChannels.map(cChannel =>
      channel.videos.filter(video =>
        (moment(video.publishedDatetime) - moment.now()).getDays() < 3)
      )
    )
)

export default connect(
  state => ({
    lastSubscribedVideos: selectLastSubscribedVideos(state),
    subscribedChannels: selectSubscribedChannels(state)
  })
)
```

Ok, game is done, if we don't want mutating action on our db.

2. requestData for mutating data:

Suppose first we can click on it to mutate isFavorite
```
{
  lastSubscribedVideos.map({ id, isFavorite, name }) => (
    <p key={id}>
      {name} {' '} {isFavorite && '*'}
    </p>
  ))
}
```
by

```
{
  lastSubscribedVideos.map(video => (
    <VideoItem
      key={video.id}
      video={video}
    />
  ))
}
```

with

```javascript
import { requestData } from 'pass-culture-shared'
import get from 'lodash.get'
import React, { Component } from 'react'

class VideoItem extends Component {

  onFavoriteClick = () => {
    const {
      dispatch,
      video,
    } = this.props
    const {
      id,
      isFavorite
    } = video
    dispatch(requestData(
      'PATCH',
      `videos/${id}`,
      {
        body: {
          isFavorite: !isFavorite
        }
      }
    ))
  }

  render () {
    const {
      video
    } = this.props
    const {
      isFavorite,
      name
    } = video
    return (
      <div>
        {name}
        {' '}
        <button onClick={this.onFavoriteClick}>
          {isFavorite && '*'}
        </button>
      </div>
    )
  }
}

export default connect()(VideoItem)

```

In this approach, onFavoriteClick the VideoItem will refresh the * accordingly to the sync state with the backend db.

But the return of the SUCCESS_DATA_PATCH_VIDEOS will feed a state.data.videos
array, and therefore the aggregated count of favorites in the channels item
will be outdated.

3. Using normalizing data

One rude way would consist in writing in the handleSucces of the 'videos/${id}'
something helping to make keeping the ChannelsPage aware of that change.

We can also use the normalizing method for doing it in a sugar manner.
We first need to tell how we want stored the data in the data reducer.

```javascript
class ChannelsPage extends Component {

  ...

  componentDidMount() {
      this.props.dispatch(requestData('GET', 'channels', {
        ...
        normalizer: {
          // normalizer is a recursive mapping process
          // KEY in each entities // KEY in the state.data
          videos:                    'videos'
        }
      }))
  }
  ...
}
```

What does this normalizer stand for ? It means here that all the channels entities
will be parsed to find if they have a KEY 'videos', and all of these elements
will be concatenated (and unified by their id) in an other state.data.videos array.

IMPORTANT NOTE:
In addition of data stored at state.data.videos,
the state.data.venues will not have anymore their nested children { videos },
as it is now a redundant and not reactive sub data info.

We need now some adaptation in the mapStateToProps of the SubscribedChannels Component:

```javascript

const selectLastSubscribedVideosByChannelId = createCachedSelector(
  state => state.data.videos,
  (state, channelId) => channelId,
  videos => (
  videos.filter(video =>
    (moment(video.publishedDatetime) - moment.now()).getDays() < 3) &&
    video.channelId === channelId
  )
)((state, channelId) => channelId || '')

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => {
    let subscribedChannels = channels.filter(channel => channel.isSubscribed)

    subscribedChannels = subscribedChannels.map(channel =>

      const lastSubscribedVideos = selectLastSubscribedVideosByChannelId(
        state, channel.id)

      Object.assign(
        {
          favoritesCount: lastSubscribedVideos.filter(video => video.isFavorite)
                                              .length
        },
        channel
      )
    )

    return subscribedChannels
  }
)

const selectLastSubscribedVideosByChannels = createSelector(
  state => state.data.videos,
  (state, channels) => channels,
  (videos, channels) => flatten(
    channels.map(channel =>
      videos.filter(video =>
        // do the retrieve tx to the joining key
        channels.find(channel =>
          video.channelId  === channel.id)
        &&
        (moment(video.publishedDatetime) - moment.now()).getDays() < 3
      )
    )
  )
)

export default connect(
  state => {
    const subscribedChannels = selectSubscribedChannels(state)
    return {
      lastSubscribedVideos: selectLastSubscribedVideosByChannels(state, subscribedChannels),
      subscribedChannels
    }
  }
)
```

If you don't feel easy with filter logic in reselects, you may
instead keep on modularizing your components and you will find by yourself
that selectors are more easy to write, for example in this case where in the ChannelsPage, let's modularize also things into ChannelItems:

replace
```javascript
{
  subscribedChannels.map(({ id, favoritesCount, name}) => (
    <p key={id}>
      {name}
      {' '}
      {favoritesCount} favorites videos
    </p>
  ))
}
```
by

```javascript
{
  subscribedChannels.map(subscribedChannel => (
    <ChannelItem key={subscribedChannel.id} channel={subscribedChannel} />
  )
}
```

Then ChannelItem does more easily the job for being sync with the videos isFavorite mutations.

```
import React from 'react'
import { connect } from 'react-redux'
import { createCachedSelector } from 're-reselect'

const ChannelItem = ({ favoritesCount, name }) => (
  <p>
    {name}
    {' '}
    {favoritesCount} favorites videos
  </p>
)

const selectFavoritesCountByChannelId => createCachedSelector(
  state => state.data.videos,
  (state, channelId) => channelId
  (videos, channelId) => videos.filter(video =>
                                  video.channelId === channelId &&
                                  video.isFavorite
                                ).length
)((state, channelId) => channelId || '')

export default connect(
  (state, ownProps) => ({
    favoritesCount: selectFavoritesCountByChannelId(state, ownProps.channel.id)
  })
)(ChannelItem)

```



































#### Arguments :

| nom | type | exemple | description |
| -- | -- | -- | -- |
| method | string | "GET" | Méthode HTTP de l'appel Rest |
| path | string | "/users/current" | URL relatif sur l'API (can be without the first trailing slash) |
| config | objet | {key: "value"} | Configuration de comportement voir ci-après |


#### Options disponibles dans l'objet config :


 **ATTENTION, DOC EN COURS DE REDACTION**


| nom | type | exemple | requis | défault | description |
| -- | -- | -- | -- | -- | -- |
| key | string | "bookings" | oui | - | Clé sous laquelle seront stockés les entities dans le store, sous `state.data` |
| normalizer | objet | - | non | `null` | |
| handleSuccess | function | - | oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| handleFail | function | - |  oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| isMergingDatum | bool | - | non | `false` | |
| isMutatingDatum | bool | - | non | `false` | |
| isMergingArray | bool | - | non | `false` | |
| isMutatingArray | bool | - | non | `false` | |
| nextState | objet | - | non | `{}` | |
| getSuccessState | function | - | non | `undefined` | |

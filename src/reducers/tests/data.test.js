import {
  assignData,
  createData,
  failData,
  requestData,
  resetData,
  successData,
  ASSIGN_DATA,
  RESET_DATA,
} from '../data'

describe('src | reducer | data', () => {
  describe.skip('createData', () => {
    describe('If Action type is ASSIGN_DATA it returns the initial state', () => {
      it('should return correct action', () => {
        // TODO To finish
        // given
        const state = {
          bookings: [],
          recommendations: [],
        }
        const action = {
          type: ASSIGN_DATA,
          method: 'POST',
          path: 'http://fakeUrl.com',
          patch: 'fake patch',
        }

        // when
        const updatedState = createData(state, action)

        const expected = {}

        // then
        expect(updatedState).toEqual(expected)
      })
    })
  })
})

describe('src | actions | data', () => {
  describe('assignData', () => {
    it('should return correct action', () => {
      // given
      const patch = 'fake patch'

      // when
      const action = assignData(patch)
      const expected = {
        patch,
        type: ASSIGN_DATA,
      }

      // then
      expect(action).toMatchObject(expected)
    })
  })
  describe('failData', () => {
    it('should return correct action', () => {
      // given
      const method = 'POST'
      const path = 'http://fakeUrl.com'
      const errors = []
      const config = {}

      // when
      const action = failData(method, path, errors, config)
      const expected = {
        config,
        errors,
        method,
        path,
        type: 'FAIL_DATA_POST_HTTP://FAKEURL.COM',
      }

      // then
      expect(action).toMatchObject(expected)
    })
  })
  describe('requestData', () => {
    it('should return correct action', () => {
      // given
      const method = 'POST'
      const path = 'http://fakeUrl.com'

      // when
      const action = requestData(method, path)
      const expected = {
        config: {},
        method: method,
        path: path,
        type: 'REQUEST_DATA_POST_HTTP://FAKEURL.COM',
      }

      // then
      expect(action).toMatchObject(expected)
    })
  })
  describe('resetData', () => {
    it('should return correct action', () => {
      // when
      const action = resetData()
      const expected = {
        type: RESET_DATA,
      }

      // then
      expect(action).toMatchObject(expected)
    })
  })
  describe('successData', () => {
    it('should return correct action', () => {
      // given
      const method = 'POST'
      const path = 'http://fakeUrl.com'
      const data = [
        {
          canBook: false,
          dateCreated: '2018-07-20T08:48:57.952778Z',
          dehumanizedId: 3,
          departementCode: '93',
          email: 'pctest.cafe@btmx.fr',
          firstThumbDominantColor: [62, 54, 51],
          id: 'FT',
          isAdmin: false,
          modelName: 'User',
          publicName: 'Utilisateur test',
          thumbCount: 1,
        },
      ]
      const config = {}

      // when
      const action = successData(method, path, data, config)
      const expected = {
        config,
        data,
        method,
        path,
        type: 'SUCCESS_DATA_POST_HTTP://FAKEURL.COM',
      }

      // then
      expect(action).toMatchObject(expected)
    })
  })
})

import React, { Component } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import withPagination from '../withPagination'

describe('src | components | hocs | withPagination', () => {
  let MockComponent, WrapperComponent
  MockComponent = renderer.create(Component)

  WrapperComponent = withPagination(MockComponent)

  describe('snapshot', () => {
    it('should match snapshot', () => {
      const props = {
        handleQueryParamsChange: jest.fn(),
      }
      const wrapper = shallow(<WrapperComponent {...props} />)
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})

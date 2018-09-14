import React, { Component }  from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import withSearch from '../withSearch'

describe('src | components | hocs | withSearch', () => {
  let MockComponent, WrapperComponent
    MockComponent = renderer.create(
    Component
    )

  WrapperComponent = withSearch(MockComponent)

  describe('snapshot', () => {
    it('should match snapshot', () => {
      const props = {
        handleQueryParamsChange: jest.fn()
      }
      const wrapper = shallow(<WrapperComponent {...props}/>)
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })

    // it('should match snapshot', () => {
    //   const props = {
    //     handleQueryParamsChange: jest.fn()
    //   }
    //   const wrapper = shallow(<WrapperComponent {...props}/>)
    //   expect(wrapper).toBeDefined()
    //   expect(wrapper).toMatchSnapshot()
    //
    //   const instance = wrapper.instance()
    //   console.log('instance', instance);
    //
    // })
  })
})

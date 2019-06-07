import 'babel-polyfill'
import React from 'react'
import { shallow } from 'enzyme'

import PatchedReactTimeInput from '../PatchedReactTimeInput'

describe('src | components | forms | PatchedReactTimeInput', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      const props = {}
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
  describe('onChangeHandler', () => {
    const onTimeChangeMock = jest.fn()
    const props = {
      onTimeChange: onTimeChangeMock
    }
    it('should return empty string when empty string given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('')
      expect(wrapper.state().time).toEqual('')
    })
    it('should not add a zero when zero is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('0')
      expect(wrapper.state().time).toEqual('0')
    })
    it('should return one hour when 1 is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('1')
      expect(wrapper.state().time).toEqual('01:')
    })
    it("should return one hour when '01' is given", () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('01')
      expect(wrapper.state().time).toEqual('01:00')
    })
  })
})

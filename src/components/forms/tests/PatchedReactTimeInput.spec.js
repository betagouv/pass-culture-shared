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

    it('should  XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('')
      expect(wrapper.state().time).toEqual('')
    })

    it('should  XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('0')
      expect(wrapper.state().time).toEqual('00:')
    })

    it('should  XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('1')
      expect(wrapper.state().time).toEqual('01:')
    })

    it('should  XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('01')
      expect(wrapper.state().time).toEqual('01:00')
    })

    it('should  XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('01:2')
      expect(wrapper.state().time).toEqual('01:02')
    })

    it('should XXX when YYY is given', () => {
      const wrapper = shallow(<PatchedReactTimeInput {...props} />)
      wrapper.instance().onChangeHandler('')
      expect(wrapper.state().time).toEqual('')
    })
  })
})

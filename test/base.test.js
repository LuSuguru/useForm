/* eslint-disable no-undef */
import { mount } from 'enzyme'
import React, { memo } from 'react'

import useForm from '../src/index'

const TestInput = memo((props) => <input {...props} />)

describe('form-base', () => {
  let form
  const Demo = ({ name, desc }) => {
    form = useForm()

    return (
      <>
        <TestInput
          className="name"
          placeholder="请输入名称"
          {...form.init('name', { initialValue: name || '' })} />

        <TestInput
          placeholder="请输入描述"
          className="desc"
          {...form.init('desc', { initialValue: desc || '' })} />
      </>
    )
  }

  it('普通渲染', () => {
    const wrapper = mount(<Demo />)

    wrapper
      .find('.name')
      .last()
      .simulate('change', { target: { value: 'name' } })


    expect(form.formData.name).toEqual('name')
  })

  it('只改变当前项的props', () => {
    const wrapper = mount(<Demo />)
    const getDescProps = () => wrapper
      .find('.desc')
      .last()
      .props()

    wrapper
      .find('.desc')
      .last()
      .simulate('change', { target: { value: 'desc' } })

    const prevProps = getDescProps()

    wrapper
      .find('.name')
      .last()
      .simulate('change', { target: { value: 'name' } })

    const nowProps = getDescProps()

    expect(prevProps).toEqual(nowProps)
  })

  it('测试 initialValue', () => {
    const wrapper = mount(<Demo name="name" desc="desc" />)


    expect()
  })
})

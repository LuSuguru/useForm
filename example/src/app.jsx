import { Form, Input, Button } from 'antd'
import React, { memo } from 'react'
import useForm from 'useform'

const { Item } = Form
const { TextArea } = Input

const FormLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
}

const TestInput = memo(({ name, value, onChange }) => (
  <input type="text" value={value || ''} onChange={onChange} />
))

function App(props) {
  const { init, formData, errorProps, setFormData, isValidateSuccess, onResetForm } = useForm()
  // console.log(formData)
  function onSubmit() {
    isValidateSuccess()
    console.log(formData)
  }

  function onReset() {
    onResetForm()
  }

  function onChange(e) {
    setFormData({ name: e.target.value })
  }

  return (
    <Form {...FormLayout}>
      <Item label="名称" required {...errorProps.name}>
        <Input
          placeholder="请输入名称"
          {...init('name', {
            initialValue: '123',
            rules: [
              { message: '必填', required: true }
            ]
          })}
        />
      </Item>
      <Item label="描述">
        <TextArea
          {...init('desc')}
          placeholder="请输入描述"
        />
      </Item>
      <TestInput {...init('test1')} name="test1" />
      <TestInput {...init('test2')} name="test2" />
      <Button onClick={onSubmit}>提交</Button>
      <Button onClick={onReset}>重置</Button>
    </Form>
  )
}

export default memo(App)

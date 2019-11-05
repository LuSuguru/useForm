import { Form, Input, Button } from 'antd'
import React, { memo } from 'react'
import useForm, { Format } from 'useform'

const { Item } = Form
const { TextArea } = Input

const FormLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
}

function App(props) {
  const { init, formData, errorProps, setErrorProps, setFormData, isValidateSuccess, onResetForm } = useForm()
  // console.log(formData)
  function onSubmit() {
    isValidateSuccess()
    console.log(formData)
  }

  function onReset() {
    onResetForm()
  }

  return (
    <>
      <Form {...FormLayout}>
        <Item label="名称" required {...errorProps.name}>
          <Input
            placeholder="请输入名称"
            {...init('name', {
              initialValue: '123',
              rules: [
                { message: '必填', required: true }
              ],
              normalize: Format.mobileFormat
            })}
          />
        </Item>
        <Item label="描述">
          <TextArea
            {...init('desc')}
            placeholder="请输入描述"
          />
        </Item>
        <input type="text" {...init('test')} />
      </Form>
      <Button onClick={onSubmit}>提交</Button>
      <Button onClick={onReset}>重置</Button>
    </>
  )
}

export default memo(App)

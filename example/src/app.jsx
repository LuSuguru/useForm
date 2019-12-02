import React, { memo , useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import useForm, { Format } from '@yt/use-form'


const { Item } = Form
const { TextArea } = Input

const FormLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
}

const Test = memo((props) => {
  console.log(props.name)
  return (
    <Item label="名称" required {...props.errorProps}>
      <Input
        placeholder="请输入名称"
        {...props.name} />
    </Item>
  )
})

function App(props) {
  const { init, formData, errorProps, setErrorProps, setFormData, isValidateSuccess, onResetForm } = useForm()
  // console.log(formData)
  function onSubmit() {
    isValidateSuccess()
    console.log(formData)
  }

  useEffect(() => {
    setFormData({
      name: 1232132
    })
  }, [])

  function onReset() {
    onResetForm()
  }

  return (
    <>
      <Form {...FormLayout}>

        <Test
          errorProps={errorProps.name}
          name={init('name', {
            initialValue: '123',
            rules: [
              { message: '必填', required: true }
            ],
            normalize: Format.mobileFormat
          })} />

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

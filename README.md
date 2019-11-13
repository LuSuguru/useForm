# use-form

一个封装了 双向绑定，校验，格式化的简易 react hook

## 使用

```js
import React, { memo } from 'react'
import { Form, Input, Button } from 'antd'
import useForm, { Format } from 'use-form'

const { Item } = Form
const { TextArea } = Input

const FormLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
}

function App(props) {
  const { init, formData, errorProps, setErrorProps, setFormData, isValidateSuccess, onResetForm } = useForm()
  
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
```

### `API接口`
```js
import useForm, { Strategies, Format } from 'use-form'
```
- [useForm](#`useForm`): hook
- [Strategies](#`rule`): 校验方法集合
- [Format](#`normalize`): Format 方法集合

### `useForm`
调用 `useForm（）`后返回的 API 接口

```js
const { init,remove } = useForm()
```

| 参数  | 说明 | 类型 |
| ---- | ---- | --- | 
| formData | 所有表单组件的 值集合| object <{ key, value: any }> |
| errorProps | 所有表单组件的 errop 信息集合 | object <{ key, { help: string; hasFeedback: boolean; validateStatus: 'error' \| 'success' }}> |
| init | 注册表单组件 | Function( key: string, options: [Object](#init)) |
| remove | 卸载表单组件 | Function( key: string ) |
| onResetForm | 重置表单 | Function() |
| isValidateSuccess | 校验一组表单，如果不传参数，则校验所有注册的表单 | Function( form?: Array\<string> ): boolean |
| setFormData | 设置某个表单的值 | Function( data: <{ key, value: any }> )|
| setErrorProps| 设置某个表单的报错信息 | Function( data: <{key, errorMsg: string)> |

### `init`
调用 `init(key: string, options: Options)` 用来注册表单组件，返回 `{value: any, onChange: Function()}` ，可以直接用于组件上

``` js
  <input {...init('name')} />
```

以下是 `Options` 的参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| valuePropName | 设置组件上的 valueProps | string | 'value' |
| initialValue | 设置组件的初始值 | any | - |
| autoValidator | 每次表单变化时是否校验 | boolean | true |
| getValueformEvent | 如何从 Event 中获取 value | (...args: any[]) => Value | - |
| normalize | 在更新前 format 值，提供了几个 normalize 方法 | (value: any) => any | - |
| rules | 校验规则 | Array\<[Rule](#rule)> | [] |

### `rule`
自定义校验规则，`Strategies` 包含 N 个 校验规则，可以直接使用

```js
<input {...init('name', {
  rules: [
    { message: 'name 必填', required: true },
    { message: 'name 至少5个字', min: 5 },
    { message: 'name 至多10个字', max: 10 },
    { message: 'name 必须为手机号', validator: Strategies.isMobile }
    {
      validator: ({ value, formData }) => {
        if (!value.includes('159')) {
          return 'name 必须包含 159'
        }
      }
    }
  ]
})} />
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 报错信息 | string | - |
| required | 是否必填 | boolean | false |
| max | 最大值 | number | - |
| min | 最小值 | number | - |
| pattern | 正则校验 | new RegExp() | - |
| validator | 自定义校验函数 | (params: { value?: any; errorMsg:string; formData?: any; }) => string | - |

### `normalize`
自定义 format 规则，`Format` 包含 N 个 Format 规则，可以直接使用

```js
  <input {...init('name', {
    normalize: (value) => value.split(0, 1)
  })} />

  <input {...init('name', {
    normalize: Format.mobileFormat
  })} />
```

## typeScript 中使用

需要定义每个表单的类型

```ts
interface FormData {
  name: string
  desc: string
}

const { init } = useForm<FormData>()
```








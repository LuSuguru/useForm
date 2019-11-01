import { useCallback, useMemo, useRef } from 'react'
import useCurrentValue from './hook/useCurrentValue'
import useStates from './hook/useStates'
import strategies, { Strategies } from './strategies'
import { FormDefinitions, Rule } from './type'
import { defaultGetValueFormEvent, getInitialValueAndError } from './utils/valueUtils'

type Value = string | number | boolean

export enum FormType {
  Select = 'select',
  Input = 'input',
  TextArea = 'textArea',
  Tel = 'tel',
  CheckBox = 'checkBox',
  CheckGroup = 'checkGroup',
  Radio = 'radio',
  TreeSelect = 'treeSelect',
  RangePicker = 'rangePicker',
  Number = 'number',
  CodeMirror = 'codeMirror',
}

export interface ErrorProp {
  help: string
  hasFeedback: boolean
  validateStatus: 'error' | 'success'
}

export type ErrorProps<T> = {
  [key in keyof T]?: ErrorProp
}

export interface FormProp {
  checked?: any
  value?: any
  onChange: (e: any) => void
}

export type FormProps<T> = {
  [key in keyof T]?: FormProp
}

export interface UseForm<T> {
  formData?: T
  setFormData?: (a: { [key in keyof T]?: any }) => void
  formProps?: FormProps<T>
  errorProps?: ErrorProps<T>,
  setErrorProps?: (a: { [key in keyof T]?: ErrorProp }) => void
  isValidateSuccess?: (form?: any) => boolean,
  onResetForm?: () => void
}

function getErrorData(help: string): ErrorProp {
  if (help) {
    return {
      help,
      hasFeedback: true,
      validateStatus: 'error',
    }
  }
  return {
    help: '',
    hasFeedback: false,
    validateStatus: 'success',
  }
}

// 表单双向绑定
export default function <T>(formDefinitions: FormDefinitions<T>): UseForm<T> {
  // 获得初始数据
  const { current } = useRef(getInitialValueAndError(formDefinitions))
  const [formData, setFormData] = useStates(current.initialValues)
  const [errorProps, setErrorProps] = useStates(current.initialErrors)
  const currentFormData = useCurrentValue(formData)
  const currentErrorProps = useCurrentValue(errorProps)

  /*
   * sideEffects: currentFormData,currentErrorProps
   */
  function onValidate(rules: Array<Rule<T>>, key: string) {
    return (value: Value) => {
      const data = currentErrorProps.current[key] || {}

      let error = ''

      rules.forEach(({ message, validator, method, param }) => {
        if (error) { return }
        const validatorMethod: any = validator || strategies[method]

        if (validatorMethod) {
          const errorMessage = validatorMethod({ value, errorMsg: message, param, formData: currentFormData.current })
          if (errorMessage) {
            error = errorMessage
          }
        }
      })

      // 避免重复渲染
      if (data.help === error) {
        return data.help
      }

      setErrorProps({ [key]: getErrorData(error) })
      return error
    }
  }

  function createForm(): FormProps<T> {
    const props: FormProps<T> = {}
    Object.keys(formDefinitions).forEach((key: string) => {
      const { valuePropName, rules, normalize, isMonitor = true, getValueformEvent } = formDefinitions[key]

      const value = formData[key]

      props[key] = useMemo(() => ({
        get [valuePropName]() {
          // checkbox props 得传 checked，其余的传 value
          if (valuePropName === 'checked') {
            return !!value
          }
          return value
        },

        onChange: (e: any) => {
          let newValue
          if (getValueformEvent) {
            newValue = getValueformEvent(e)
          } else {
            newValue = defaultGetValueFormEvent(valuePropName, e)
          }

          if (normalize) {
            newValue = normalize(newValue)
          }

          if (rules && rules.length > 0 && isMonitor) {
            onValidate(rules, key)(newValue)
          }

          setFormData({ [key]: newValue })
        },
      }), [value])
    })

    return props
  }

  const isValidateSuccess = useCallback((form?: any) => (form || Object.keys(currentFormData.current)).filter((key: string) => {
    const value = currentFormData.current[key]
    const { rules } = formDefinitions[key]

    if (rules && rules.length > 0) {
      return onValidate(rules, key)(value)
    }
    return false
  }).length === 0, [formDefinitions])

  // 对外的setForm，做一层处理，将校验清空
  const publicSetFormData = useCallback((data: T) => {
    const errorProps = Object.keys(data).reduce((prev, key) => ({
      ...prev,
      [key]: {
        help: '',
        hasFeedback: false,
      },
    }), {})
    setErrorProps(errorProps)
    setFormData(data)
  }, [])

  const onResetForm = useCallback(() => {
    const { data } = getInitialValue(formDefinitions)
    publicSetFormData(data)
  }, [publicSetFormData])

  return {
    formData,
    setFormData: publicSetFormData,
    formProps: createForm(),
    errorProps,
    setErrorProps,
    isValidateSuccess,
    onResetForm,
  }
}

import { SyntheticEvent, useCallback, useRef } from 'react'
import * as Format from './format'
import useCurrentValue from './hook/useCurrentValue'
import useStates from './hook/useStates'
import * as Strategies from './strategies'
import { ErrorProp, FormDefinition, UseForm, Value } from './type'
import { getErrorData, getValidatorMethod } from './utils/validateUtil'
import { defaultGetValueFormEvent, getInitialValue, getInitialValueAndError } from './utils/valueUtils'

const defaultOptions = {
  valuePropName: 'value',
  autoValidator: true,
}

// 表单双向绑定
export default function <T>(): UseForm<T> {
  const [formData, setFormData] = useStates({} as any)
  const [errorProps, setErrorProps] = useStates({} as any)

  const currentFormData = useCurrentValue(formData)
  const currentErrorProps = useCurrentValue(errorProps)
  const formProps = useRef({})
  const formDefs = useRef({})

  /*
   * sideEffects: currentFormData,currentErrorProps
   */
  function onValidate(key: string) {
    return (value: Value) => {
      const errorProp = currentErrorProps.current[key] || {}
      const { rules } = formDefs.current[key]

      let error = ''

      rules.forEach((rule) => {
        if (error) { return }

        const validatorMethod = getValidatorMethod(rule)

        if (validatorMethod) {
          const errorMessage = validatorMethod({ value, errorMsg: rule.message, formData: currentFormData.current })

          if (errorMessage) {
            error = errorMessage
          }
        }
      })

      // 避免重复渲染
      if (errorProp.help === error) {
        return errorProp.help
      }

      setErrorProps({ [key]: getErrorData(error) })
      return error
    }
  }

  function init(formName: string, options: FormDefinition<T> = defaultOptions) {
    const memoizedFormProp = formProps.current[formName]
    if (memoizedFormProp) {
      return memoizedFormProp
    }

    const { valuePropName = 'value', initialValue, rules, autoValidator = true, normalize, getValueformEvent } = options

    formDefs.current[formName] = options
    currentFormData.current[formName] = getInitialValue(initialValue)

    const formProp = {
      get [valuePropName]() {
        const value = currentFormData.current[formName]

        if (value === 'checked') {
          return !!value
        }
        return value
      },

      onChange(e: SyntheticEvent<HTMLElement>) {
        let newValue: Value
        if (getValueformEvent) {
          newValue = getValueformEvent(e)
        } else {
          newValue = defaultGetValueFormEvent(valuePropName, e)
        }

        if (normalize) {
          newValue = normalize(newValue)
        }

        if (rules && rules.length > 0 && autoValidator) {
          onValidate(formName)(newValue)
        }

        setFormData({ [formName]: newValue })
      },
    }

    formProps.current[formName] = formProp

    return formProp
  }

  // 对外的setForm，做一层处理，将校验清空
  const publicSetFormData = useCallback((data: T) => {
    const newErrorProps = Object.keys(data).reduce((prev, key) => ({
      ...prev,
      [key]: {
        help: '',
        hasFeedback: false,
        validateStatus: 'success',
      },
    }), {})

    setErrorProps(newErrorProps)
    setFormData(data)
  }, [])

  const publicSetErrorProps = useCallback((data: { [key in keyof T]: string }) => {
    const newErrorProps = Object.keys(data).reduce((prev, key) => {
      let newErrorProp: ErrorProp
      if (data[key]) {
        newErrorProp = {
          help: data[key],
          hasFeedback: true,
          validateStatus: 'error',
        }
      } else {
        newErrorProp = {
          help: '',
          hasFeedback: false,
          validateStatus: 'success',
        }
      }

      return {
        ...prev,
        [key]: newErrorProp,
      }
    }, {})

    setErrorProps(newErrorProps)
  }, [])

  const isValidateSuccess = useCallback((form?: any) => (form || Object.keys(currentFormData.current)).filter((key: string) => {
    const value = currentFormData.current[key]
    const { rules } = formDefs.current[key]

    if (rules && rules.length > 0) {
      return onValidate(key)(value)
    }

    return false
  }).length === 0, [])

  const onResetForm = useCallback(() => {
    const { initialValues } = getInitialValueAndError(formDefs.current)

    publicSetFormData(initialValues)
  }, [publicSetFormData])

  return {
    formData,
    errorProps,
    init,
    setFormData: publicSetFormData,
    setErrorProps: publicSetErrorProps,
    isValidateSuccess,
    onResetForm,
  }
}

export {
  Strategies,
  Format,
}



import { SyntheticEvent, useCallback, useMemo, useRef } from 'react'
import * as Format from './format'
import useCurrentValue from './hook/useCurrentValue'
import useStates from './hook/useStates'
import * as Strategies from './strategies'
import { ErrorProp, FormDefinition, FormProp, UseForm, Value } from './type'
import { getErrorData, getValidatorMethod } from './utils/validateUtil'
import { defaultGetValueFormEvent, getInitialValue, getInitialValueAndError } from './utils/valueUtils'

const defaultOptions: any = {
  valuePropName: 'value',
  autoValidator: true,
}

// 表单双向绑定
export default function <T>(): UseForm<T> {
  const [formData, setFormData] = useStates({} as any)
  const [errorProps, setErrorProps] = useStates({} as any)

  const currentFormData = useCurrentValue<T>(formData)
  const currentErrorProps = useCurrentValue(errorProps)
  const formProps = useRef<any>({})
  const formDefs = useRef<any>({})
  const formMemoInfo = useRef<any>({})

  /*
   * sideEffects: currentFormData,currentErrorProps
   */
  function onValidate(key: keyof T) {
    return (value: Value) => {
      const errorProp = currentErrorProps.current[key] || {}
      const { rules } = formDefs.current[key] || {}

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

  function init<K extends keyof T>(formName: K, options?: FormDefinition<T, K>): FormProp {
    const memoizedFormProp = formProps.current[formName]
    if (memoizedFormProp && formMemoInfo.current[formName]) {
      return memoizedFormProp
    }

    formMemoInfo.current[formName] = true

    const { valuePropName = 'value', initialValue, rules, autoValidator = true, normalize, getValueformEvent } = options || defaultOptions

    formDefs.current[formName] = options || defaultOptions

    if (currentFormData.current[formName] === undefined) {
      currentFormData.current[formName] = getInitialValue(initialValue)
    }

    const formProp = {
      get [valuePropName]() {
        const value = currentFormData.current[formName]

        if (valuePropName === 'checked') {
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

        // 是否需要记忆，如果把 formProps 整个作为 props 往下传，可能直接拿缓存，可能会出现引用未变导致不触发渲染
        if (currentFormData.current[formName] !== newValue) {
          formMemoInfo.current[formName] = false
        }
        setFormData({ [formName]: newValue })
      },
    }

    formProps.current[formName] = formProp
    return formProp
  }

  const { remove, isValidateSuccess, publicSetErrorProps, publicSetFormData, onResetForm } = useMemo(() => ({
    remove(key: keyof T) {
      delete currentFormData.current[key]
      delete currentErrorProps.current[key]
      delete formDefs.current[key]
      delete formProps.current[key]
    },

    // 对外的setForm，做一层处理，将校验清空
    publicSetFormData(data: T) {
      const newErrorProps = Object.keys(data).reduce((prev, key) => {
        // prop 需要变化，所以标记记上
        formMemoInfo.current[key] = false

        return {
          ...prev,
          [key]: {
            help: '',
            hasFeedback: false,
            validateStatus: 'success',
          },
        }
      }, {})



      setErrorProps(newErrorProps)
      setFormData(data)
    },

    publicSetErrorProps(data: { [key in keyof T]: string }) {
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
    },

    isValidateSuccess(form?: Array<keyof T>) {
      return (form || Object.keys(currentFormData.current) as Array<keyof T>).filter((key: keyof T) => {
        const value = currentFormData.current[key] || ''
        const { rules } = formDefs.current[key] || {}

        if (rules && rules.length > 0) {
          return onValidate(key)(value)
        }

        return false
      }).length === 0
    },

    onResetForm() {
      const { initialValues } = getInitialValueAndError(formDefs.current)
      publicSetFormData(initialValues)
    },
  }), [])

  return {
    formData,
    errorProps,
    init,
    remove,
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



import { useCallback, useMemo, useRef } from 'react'
import useCurrentValue from './hook/useCurrentValue'
import useStates from './hook/useStates'
import { FormDefinitions, FormProps, Rule, UseForm, Value } from './type'
import { getErrorData, getValidatorMethod } from './utils/validateUtil'
import { defaultGetValueFormEvent, getInitialValueAndError } from './utils/valueUtils'

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
      const errorProp = currentErrorProps.current[key] || {}

      let error = ''

      rules.forEach((rule) => {
        if (error) { return }

        const validatorMethod: any = getValidatorMethod(rule)

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

  function createForm(): FormProps<T> {
    const props: FormProps<T> = {}
    Object.keys(formDefinitions).forEach((key: string) => {
      const { valuePropName, rules, normalize, getValueformEvent } = formDefinitions[key]

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

          if (rules && rules.length > 0) {
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

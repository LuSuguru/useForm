import { isMax, isMin, isReg, isRequired } from '../strategies'
import { ErrorProp, Rule } from '../type'

export function getValidatorMethod<T>(rule: Rule<T>) {
  const { required, max, min, pattern, validator } = rule

  if (required) {
    return isRequired
  }

  if (max) {
    return ({ value, errorMsg }) => isMax({ value, errorMsg, max })
  }

  if (min) {
    return ({ value, errorMsg }) => isMin({ value, errorMsg, min })
  }

  if (pattern) {
    return ({ value, errorMsg }) => isReg({ value, errorMsg, pattern })
  }

  return validator
}

export function getErrorData(help: string): ErrorProp {
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

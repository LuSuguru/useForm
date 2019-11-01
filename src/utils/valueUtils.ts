import { EventArg, Value } from '../type'
import { FormDefinitions } from './../type'

export function defaultGetValueFormEvent(valuePropName: string = 'value', event: EventArg): Value {
  if (event && event.target && valuePropName in event.target) {
    return (event.target as HTMLInputElement)[valuePropName]
  }
  return event
}

export function getInitialValueAndError<T>(formDefinitions: FormDefinitions<T>): any {
  const initialValues = {}
  const initialErrors = {}

  Object.keys(formDefinitions).forEach((key: string) => {
    const { initialValue, rules } = formDefinitions[key]

    if (initialValue !== undefined) {
      initialValues[key] = initialValue
    } else {
      initialValues[key] = undefined
    }

    if (rules) {
      initialErrors[key] = {
        help: '',
        hasFeedback: false,
      }
    }
  })

  return { initialValues, initialErrors }
}

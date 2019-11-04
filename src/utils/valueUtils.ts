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
    const { initialValue } = formDefinitions[key]

    initialValues[key] = getInitialValue(initialValue)
    initialErrors[key] = {
      help: '',
      hasFeedback: false,
    }
  })

  return { initialValues, initialErrors }
}

export function getInitialValue(initialValue: Value) {
  if (initialValue !== undefined) {
    return initialValue
  } else {
    return undefined
  }
}


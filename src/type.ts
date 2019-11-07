export type EventArg = any
export type Value = any

export interface Rule<T> {
  message?: string // 错误信息
  required?: boolean // 是否必填
  max?: number // 最大值
  min?: number // 最小值
  pattern?: RegExp  // 正则
  // validateTrigger?: string | string[] // 需要校验的方法
  validator?: (params: { value?: any, param?: any, formData?: T }) => string // 自定义校验
}

export interface FormDefinition<T> {
  valuePropName?: string
  initialValue?: Value
  rules?: Array<Rule<T>> // 校验规则
  autoValidator?: boolean // 是否自动校验
  normalize?: (value: Value) => Value // 格式化
  getValueformEvent?: (...args: any[]) => Value
}

export type FormDefinitions<T> = {
  [key in keyof T]?: FormDefinition<T>
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
  checked?: Value
  value?: Value
  onChange: (e: any) => void
}

export type FormProps<T> = {
  [key in keyof T]?: FormProp
}

export interface UseForm<T> {
  formData: T
  errorProps: ErrorProps<T>,
  setFormData: (data: { [key in keyof T]?: T[key] }) => void
  setErrorProps: (data: { [key in keyof T]: string }) => void
  isValidateSuccess: (form?: Array<keyof T>) => boolean,
  onResetForm: () => void
  init: (formName: keyof T, options?: FormDefinition<T>) => void
  remove: (data: keyof T) => void
}



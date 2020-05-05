export type EventArg = any
export type Value = any

export interface Rule<T> {
  message?: string // 错误信息
  required?: boolean // 是否必填
  max?: number // 最大值
  min?: number // 最小值
  pattern?: RegExp  // 正则
  // validateTrigger?: string | string[] // 需要校验的方法
  validator?: (params: { value?: any, errorMsg?: any, formData?: T }) => string // 自定义校验
}

export interface FormDefinition<T, K extends keyof T> {
  valuePropName?: string
  initialValue?: T[K]
  rules?: Array<Rule<T>> // 校验规则
  autoValidator?: boolean // 是否自动校验
  normalize?: (value: T[K]) => T[K] // 格式化
  getValueformEvent?: (...args: any[]) => T[K]
  onChange?: (value: T[K]) => any // onChange 的勾子
}

export type FormDefinitions<T> = {
  [key in keyof T]?: FormDefinition<T, key>
}

export interface ErrorProp {
  help: string
  hasFeedback: boolean
  validateStatus: 'error' | 'success'
}

export type ErrorProps<T> = {
  [key in keyof T]?: ErrorProp
}

export interface FormProp<K extends keyof T, T> {
  checked?: boolean
  value?: T[K]
  onChange: (e: any) => void
}

export interface UseForm<T> {
  formData: T
  errorProps: ErrorProps<T>,
  setFormData: (data: { [key in keyof T]?: T[key] }) => void
  setErrorProps: (data: { [key in keyof T]: string }) => void
  isValidateSuccess: (form?: Array<keyof T>) => boolean,
  onResetForm: () => void
  init: <K extends keyof T>(formName: K, options?: FormDefinition<T, K>) => FormProp<K, T>
  remove: (data: keyof T) => void
}



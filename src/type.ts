import { Format } from './format'
import { Strategies } from './strategies'

export type EventArg = any
export type Value = any

export interface Rule<T> {
  message?: string // 错误信息
  method?: Strategies // 校验方法
  param?: any // 校验的参数
  validator?: (params: { value?: any, param?: any, formData?: T }) => string // 自定义校验器
}

export interface FormDefinition<T> {
  valuePropName?: string
  initialValue?: Value
  rules?: Array<Rule<T>> // 校验规则
  isMonitor?: boolean // 是否实时校验

  normalize?: (value: Value) => Value // 格式化
  getValueformEvent?: (...args: any[]) => Value
}

export type FormDefinitions<T> = {
  [key in keyof T]: FormDefinition<T>
}



export declare type EventArg = any;
export declare type Value = any;
export interface Rule<T> {
    message?: string;
    required?: boolean;
    max?: number;
    min?: number;
    pattern?: RegExp;
    validator?: (params: {
        value?: any;
        param?: any;
        formData?: T;
    }) => string;
}
export interface FormDefinition<T> {
    valuePropName?: string;
    initialValue?: Value;
    rules?: Array<Rule<T>>;
    autoValidator?: boolean;
    normalize?: (value: Value) => Value;
    getValueformEvent?: (...args: any[]) => Value;
}
export declare type FormDefinitions<T> = {
    [key in keyof T]?: FormDefinition<T>;
};
export interface ErrorProp {
    help: string;
    hasFeedback: boolean;
    validateStatus: 'error' | 'success';
}
export declare type ErrorProps<T> = {
    [key in keyof T]?: ErrorProp;
};
export interface FormProp {
    checked?: Value;
    value?: Value;
    onChange: (e: any) => void;
}
export declare type FormProps<T> = {
    [key in keyof T]?: FormProp;
};
export interface UseForm<T> {
    formData: T;
    errorProps: ErrorProps<T>;
    setFormData: (data: {
        [key in keyof T]?: T[key];
    }) => void;
    setErrorProps: (data: {
        [key in keyof T]: string;
    }) => void;
    isValidateSuccess: (form?: Array<keyof T>) => boolean;
    onResetForm: () => void;
    init: (formName: keyof T, options?: FormDefinition<T>) => void;
    remove: (data: keyof T) => void;
}

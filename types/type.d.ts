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
        errorMsg?: any;
        formData?: T;
    }) => string;
}
export interface FormDefinition<T, K extends keyof T> {
    valuePropName?: string;
    initialValue?: T[K];
    rules?: Array<Rule<T>>;
    autoValidator?: boolean;
    normalize?: (value: T[K]) => T[K];
    getValueformEvent?: (...args: any[]) => T[K];
    onChange: (value: T[K]) => any;
}
export declare type FormDefinitions<T> = {
    [key in keyof T]?: FormDefinition<T, key>;
};
export interface ErrorProp {
    help: string;
    hasFeedback: boolean;
    validateStatus: 'error' | 'success';
}
export declare type ErrorProps<T> = {
    [key in keyof T]?: ErrorProp;
};
export interface FormProp<K extends keyof T, T> {
    checked?: boolean;
    value?: T[K];
    onChange: (e: any) => void;
}
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
    init: <K extends keyof T>(formName: K, options?: FormDefinition<T, K>) => FormProp<K, T>;
    remove: (data: keyof T) => void;
}

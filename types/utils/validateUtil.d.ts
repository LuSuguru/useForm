import { isRequired } from '../strategies';
import { ErrorProp, Rule } from '../type';
export declare function getValidatorMethod<T>(rule: Rule<T>): typeof isRequired | ((params: {
    value?: any;
    errorMsg?: any;
    formData?: T;
}) => string);
export declare function getErrorData(help: string): ErrorProp;

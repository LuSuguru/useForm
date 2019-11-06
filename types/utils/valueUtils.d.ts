import { EventArg, Value } from '../type';
import { FormDefinitions } from './../type';
export declare function defaultGetValueFormEvent(valuePropName: string, event: EventArg): Value;
export declare function getInitialValueAndError<T>(formDefinitions: FormDefinitions<T>): any;
export declare function getInitialValue(initialValue: Value): any;

import { useRef, useReducer, useCallback } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function useCurrentValue(value) {
    var ref = useRef(null);
    ref.current = value;
    return ref;
}
//# sourceMappingURL=useCurrentValue.js.map

function stateReducer(state, newState) {
    if (typeof newState === 'function') {
        newState = newState(state);
    }
    return __assign(__assign({}, state), newState);
}
function useStates (initialState, reducer) {
    if (reducer === void 0) { reducer = stateReducer; }
    var _a = useReducer(reducer, initialState), state = _a[0], setState = _a[1];
    var onReset = useCallback(function () {
        setState(initialState);
    }, []);
    return [state, setState, onReset];
}
//# sourceMappingURL=useStates.js.map

function isRequired(_a) {
    var value = _a.value, errorMsg = _a.errorMsg;
    if (Array.isArray(value) && !value.length) {
        return errorMsg;
    }
    if (value === '' || value === false || value === undefined) {
        return errorMsg;
    }
}
function isReg(_a) {
    var value = _a.value, pattern = _a.pattern, errorMsg = _a.errorMsg;
    if (value && !value.match(pattern)) {
        return errorMsg;
    }
}
function isMax(_a) {
    var value = _a.value, max = _a.max, errorMsg = _a.errorMsg;
    if (value && value.length > max) {
        return errorMsg;
    }
}
function isMin(_a) {
    var value = _a.value, min = _a.min, errorMsg = _a.errorMsg;
    if (value && value.length < min) {
        return errorMsg;
    }
}
//# sourceMappingURL=strategies.js.map

function getValidatorMethod(rule) {
    var required = rule.required, max = rule.max, min = rule.min, pattern = rule.pattern, validator = rule.validator;
    if (required) {
        return isRequired;
    }
    if (max) {
        return function (_a) {
            var value = _a.value, errorMsg = _a.errorMsg;
            return isMax({ value: value, errorMsg: errorMsg, max: max });
        };
    }
    if (min) {
        return function (_a) {
            var value = _a.value, errorMsg = _a.errorMsg;
            return isMin({ value: value, errorMsg: errorMsg, min: min });
        };
    }
    if (pattern) {
        return function (_a) {
            var value = _a.value, errorMsg = _a.errorMsg;
            return isReg({ value: value, errorMsg: errorMsg, pattern: pattern });
        };
    }
    return validator;
}
function getErrorData(help) {
    if (help) {
        return {
            help: help,
            hasFeedback: true,
            validateStatus: 'error',
        };
    }
    return {
        help: '',
        hasFeedback: false,
        validateStatus: 'success',
    };
}
//# sourceMappingURL=validateUtil.js.map

function defaultGetValueFormEvent(valuePropName, event) {
    if (valuePropName === void 0) { valuePropName = 'value'; }
    if (event && event.target && valuePropName in event.target) {
        return event.target[valuePropName];
    }
    return event;
}
function getInitialValueAndError(formDefinitions) {
    var initialValues = {};
    var initialErrors = {};
    Object.keys(formDefinitions).forEach(function (key) {
        var initialValue = formDefinitions[key].initialValue;
        initialValues[key] = getInitialValue(initialValue);
        initialErrors[key] = {
            help: '',
            hasFeedback: false,
        };
    });
    return { initialValues: initialValues, initialErrors: initialErrors };
}
function getInitialValue(initialValue) {
    if (initialValue !== undefined) {
        return initialValue;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=valueUtils.js.map

var defaultOptions = {
    valuePropName: 'value',
    autoValidator: true,
};
// 表单双向绑定
function index () {
    var _a = useStates({}), formData = _a[0], setFormData = _a[1];
    var _b = useStates({}), errorProps = _b[0], setErrorProps = _b[1];
    var currentFormData = useCurrentValue(formData);
    var currentErrorProps = useCurrentValue(errorProps);
    var formProps = useRef({});
    var formDefs = useRef({});
    /*
     * sideEffects: currentFormData,currentErrorProps
     */
    function onValidate(key) {
        return function (value) {
            var _a;
            var errorProp = currentErrorProps.current[key] || {};
            var rules = formDefs.current[key].rules;
            var error = '';
            rules.forEach(function (rule) {
                if (error) {
                    return;
                }
                var validatorMethod = getValidatorMethod(rule);
                if (validatorMethod) {
                    var errorMessage = validatorMethod({ value: value, errorMsg: rule.message, formData: currentFormData.current });
                    if (errorMessage) {
                        error = errorMessage;
                    }
                }
            });
            // 避免重复渲染
            if (errorProp.help === error) {
                return errorProp.help;
            }
            setErrorProps((_a = {}, _a[key] = getErrorData(error), _a));
            return error;
        };
    }
    var init = useCallback(function (formName, options) {
        var _a;
        if (options === void 0) { options = defaultOptions; }
        var memoizedFormProp = formProps.current[formName];
        if (memoizedFormProp) {
            return memoizedFormProp;
        }
        var _b = options.valuePropName, valuePropName = _b === void 0 ? 'value' : _b, initialValue = options.initialValue, rules = options.rules, _c = options.autoValidator, autoValidator = _c === void 0 ? true : _c, normalize = options.normalize, getValueformEvent = options.getValueformEvent;
        formDefs.current[formName] = options;
        currentFormData.current[formName] = getInitialValue(initialValue);
        var formProp = (_a = {},
            Object.defineProperty(_a, valuePropName, {
                get: function () {
                    var value = currentFormData.current[formName];
                    if (value === 'checked') {
                        return !!value;
                    }
                    return value;
                },
                enumerable: true,
                configurable: true
            }),
            _a.onChange = function (e) {
                var _a;
                var newValue;
                if (getValueformEvent) {
                    newValue = getValueformEvent(e);
                }
                else {
                    newValue = defaultGetValueFormEvent(valuePropName, e);
                }
                if (normalize) {
                    newValue = normalize(newValue);
                }
                if (rules && rules.length > 0 && autoValidator) {
                    onValidate(formName)(newValue);
                }
                setFormData((_a = {}, _a[formName] = newValue, _a));
            },
            _a);
        formProps.current[formName] = formProp;
        return formProp;
    }, []);
    var isValidateSuccess = useCallback(function (form) { return (form || Object.keys(currentFormData.current)).filter(function (key) {
        var value = currentFormData.current[key];
        var rules = formDefs.current[key].rules;
        if (rules && rules.length > 0) {
            return onValidate(key)(value);
        }
        return false;
    }).length === 0; }, []);
    // 对外的setForm，做一层处理，将校验清空
    var publicSetFormData = useCallback(function (data) {
        var newErrorProps = Object.keys(data).reduce(function (prev, key) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = {
                help: '',
                hasFeedback: false,
                validateStatus: 'success',
            }, _a)));
        }, {});
        setErrorProps(newErrorProps);
        setFormData(data);
    }, []);
    var onResetForm = useCallback(function () {
        var initialValues = getInitialValueAndError(formDefs.current).initialValues;
        publicSetFormData(initialValues);
    }, [publicSetFormData]);
    return {
        formData: formData,
        errorProps: errorProps,
        setFormData: publicSetFormData,
        setErrorProps: setErrorProps,
        isValidateSuccess: isValidateSuccess,
        onResetForm: onResetForm,
        init: init,
    };
}

export default index;

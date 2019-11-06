declare function isRequired({ value, errorMsg }: {
    value: any;
    errorMsg: any;
}): any;
declare function isPrice({ value, errorMsg }: {
    value: any;
    errorMsg: any;
}): any;
declare function isMobile({ value, errorMsg }: {
    value?: string;
    errorMsg: any;
}): any;
declare function isIdentity({ value, errorMsg }: {
    value: any;
    errorMsg: any;
}): any;
declare function isReg({ value, pattern, errorMsg }: {
    value: any;
    pattern: any;
    errorMsg: any;
}): any;
declare function isVerify({ value, errorMsg }: {
    value: any;
    errorMsg: any;
}): any;
declare function isMax({ value, max, errorMsg }: {
    value: any;
    max: any;
    errorMsg: any;
}): any;
declare function isMin({ value, min, errorMsg }: {
    value: any;
    min: any;
    errorMsg: any;
}): any;
export { isRequired, isPrice, isMobile, isIdentity, isReg, isVerify, isMax, isMin, };

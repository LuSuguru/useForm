export enum Strategies {
  isRequired = 'isRequired',
  isPrice = 'isPrice',
  isMobile = 'isMobile',
  isIdentity = 'isIdentity',
  isReg = 'isReg',
  isVerify = 'isVerify',
  isMax = 'isMax',
  isMin = 'isMin'
}

export default {
  isRequired({ value, errorMsg }) {
    if (Array.isArray(value) && !value.length) {
      return errorMsg
    }
    if (value === '' || value === false || value === undefined) {
      return errorMsg
    }
  },
  isPrice({ value, errorMsg }) {
    if (value && !value.match(/^(0|[1-9]+)(\.[0-9]+)?$/)) {
      return errorMsg
    }
  },
  isMobile({ value = '', errorMsg }) {
    if (value && !value.match(/^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/)) {
      return errorMsg
    }
  },
  isIdentity({ value, errorMsg }) {
    if (value && !value.match(/^\d{17}[0-9Xx]$/)) {
      return errorMsg
    }
  },
  isReg({ value, pattern, errorMsg }) {
    if (value && !value.match(pattern)) {
      return errorMsg
    }
  },
  isVerify({ value, errorMsg }) {
    if (value && !value.match(/\d{4}/)) {
      return errorMsg
    }
  },
  isMax({ value, param, errorMsg }) {
    if (value && value.length > param) {
      return errorMsg
    }
  },
  isMin({ value, param, errorMsg }) {
    if (value && value.length < param) {
      return errorMsg
    }
  }
}

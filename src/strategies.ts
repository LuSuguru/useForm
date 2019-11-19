function isRequired({ value, errorMsg }) {
  if (Array.isArray(value) && !value.length) {
    return errorMsg
  }
  if (value === '' || value === false || value === undefined) {
    return errorMsg
  }
}

function isPrice({ value, errorMsg }) {
  if (value && !value.toString().match(/^(0|[1-9]+)(\.[0-9]+)?$/)) {
    return errorMsg
  }
}

function isMobile({ value = '', errorMsg }) {
  if (value && !value.toString().match(/^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/)) {
    return errorMsg
  }
}

function isIdentity({ value, errorMsg }) {
  if (value && !value.toString().match(/^\d{17}[0-9Xx]$/)) {
    return errorMsg
  }
}

function isReg({ value, pattern, errorMsg }) {
  if (value && !value.toString().match(pattern)) {
    return errorMsg
  }
}

function isVerify({ value, errorMsg }) {
  if (value && !value.toString().match(/\d{4}/)) {
    return errorMsg
  }
}

function isMax({ value, max, errorMsg }) {
  if (value && value.toString().length > max) {
    return errorMsg
  }
}

function isMin({ value, min, errorMsg }) {
  if (value && value.toString().length < min) {
    return errorMsg
  }
}

export {
  isRequired,
  isPrice,
  isMobile,
  isIdentity,
  isReg,
  isVerify,
  isMax,
  isMin,
}

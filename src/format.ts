function mobileFormat(value = '') {
  value = value.replace(/\D/g, '').slice(0, 11)

  if (value.length < 4) {
    return value
  }

  if (value.length >= 4 && value.length < 8) {
    return value.replace(/(\d{3})/, '$1 ')
  }

  if (value.length >= 8) {
    return value.replace(/(\d{3})(\d{4})/, '$1 $2 ')
  }
}

function verifyFormat(value = '') {
  value = value.replace(/\D/g, '').slice(0, 4)
  return value
}

function identityFormat(value = '') {
  value = value.replace(/\s/g, '').slice(0, 18)

  if (value.length < 7) {
    return value
  }

  if (value.length >= 7 && value.length < 15) {
    return value.replace(/(\d{6})/, '$1 ')
  }

  if (value.length >= 15) {
    return value.replace(/(\d{6})(\d{8})/, '$1 $2 ')
  }
}

export {
  mobileFormat,
  verifyFormat,
  identityFormat,
}

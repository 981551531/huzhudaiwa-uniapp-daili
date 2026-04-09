export function isRequired(value) {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).length > 0
  }

  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function minLength(value, length) {
  return String(value || '').trim().length >= length
}

export function maxLength(value, length) {
  return String(value || '').trim().length <= length
}

export function isMobile(value) {
  return /^1[3-9]\d{9}$/.test(String(value || '').trim())
}

export function isEmail(value) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(value || '').trim())
}

export function isNumber(value) {
  return !Number.isNaN(Number(value))
}

export function isPositiveNumber(value) {
  return isNumber(value) && Number(value) > 0
}

export function createRule(validator, message) {
  return {
    validator,
    message
  }
}

export function validateValue(value, rules = []) {
  for (const rule of rules) {
    if (typeof rule?.validator !== 'function') {
      continue
    }

    const valid = rule.validator(value)
    if (!valid) {
      return {
        valid: false,
        message: rule.message || 'Ð£ÑéÊ§°Ü'
      }
    }
  }

  return {
    valid: true,
    message: ''
  }
}

export function validateForm(model = {}, schema = {}) {
  const errors = {}

  Object.keys(schema).forEach((key) => {
    const result = validateValue(model[key], schema[key] || [])
    if (!result.valid) {
      errors[key] = result.message
    }
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  isRequired,
  minLength,
  maxLength,
  isMobile,
  isEmail,
  isNumber,
  isPositiveNumber,
  createRule,
  validateValue,
  validateForm
}

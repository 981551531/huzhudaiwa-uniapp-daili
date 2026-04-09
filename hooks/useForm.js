import { computed, reactive, ref } from 'vue'
import { validateForm, validateValue } from '@/utils/validator.js'

function cloneModel(model = {}) {
  return JSON.parse(JSON.stringify(model))
}

export function useForm(initialValues = {}, schema = {}) {
  const model = reactive(cloneModel(initialValues))
  const errors = reactive({})
  const touched = reactive({})
  const validating = ref(false)

  const isValid = computed(() => Object.keys(errors).length === 0)

  function clearErrors() {
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
  }

  function clearFieldError(field) {
    delete errors[field]
  }

  function setFieldValue(field, value) {
    model[field] = value
  }

  function setValues(values = {}) {
    Object.keys(values).forEach((key) => {
      model[key] = values[key]
    })
  }

  function touchField(field) {
    touched[field] = true
  }

  function validateField(field) {
    const result = validateValue(model[field], schema[field] || [])

    if (!result.valid) {
      errors[field] = result.message
      return result
    }

    clearFieldError(field)
    return result
  }

  async function validate(fields) {
    validating.value = true

    try {
      if (Array.isArray(fields) && fields.length) {
        const fieldErrors = {}

        fields.forEach((field) => {
          const result = validateField(field)
          if (!result.valid) {
            fieldErrors[field] = result.message
          }
        })

        return {
          valid: Object.keys(fieldErrors).length === 0,
          errors: fieldErrors
        }
      }

      const result = validateForm(model, schema)
      clearErrors()
      Object.assign(errors, result.errors)
      return result
    } finally {
      validating.value = false
    }
  }

  function reset(nextValues = initialValues) {
    const source = cloneModel(nextValues)

    Object.keys(model).forEach((key) => {
      if (!(key in source)) {
        delete model[key]
      }
    })

    Object.keys(source).forEach((key) => {
      model[key] = source[key]
    })

    clearErrors()
    Object.keys(touched).forEach((key) => {
      delete touched[key]
    })
  }

  return {
    model,
    errors,
    touched,
    validating,
    isValid,
    setFieldValue,
    setValues,
    touchField,
    validateField,
    validate,
    clearErrors,
    clearFieldError,
    reset
  }
}

export default useForm

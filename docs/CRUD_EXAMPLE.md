# CRUD Example

This file shows a full create, read, update, and delete example using the current framework utilities and hooks.

## API Layer

Create a business API module first:

```js
// api/modules/product.js
import http from '@/utils/request.js'

export const productApi = {
  getList: (params) => http.get('/product/list', params),
  getDetail: (id) => http.get(`/product/detail/${id}`),
  create: (data) => http.post('/product/create', data),
  update: (id, data) => http.put(`/product/update/${id}`, data),
  remove: (id) => http.delete(`/product/delete/${id}`)
}
```

## Page Example

```vue
<script setup>
import { reactive, ref } from 'vue'
import { useForm, useLoginGuard, usePaging, useRequest, useSubmit } from '@/hooks'
import { createRule, emit, isPositiveNumber, isRequired, validateForm } from '@/utils'
import { productApi } from '@/api/modules/product.js'

const editingId = ref(0)
const formData = reactive({
  name: '',
  price: '',
  status: 1
})
const { runWithLogin } = useLoginGuard()
const { errors, validate } = useForm(formData, formSchema)

const formSchema = {
  name: [createRule(isRequired, 'Name is required')],
  price: [
    createRule(isRequired, 'Price is required'),
    createRule(isPositiveNumber, 'Price must be greater than 0')
  ]
}

const {
  list,
  loading,
  refreshing,
  loadingMore,
  finished,
  refresh,
  loadMore
} = usePaging((params) => productApi.getList(params), {
  immediate: true,
  initialPageSize: 10
})

const {
  loading: detailLoading,
  data: detailData,
  runAsync: fetchDetail,
  reset: resetDetail
} = useRequest((id) => productApi.getDetail(id), {
  defaultValue: null
})

const { submitting, submitAsync } = useSubmit(async () => {
  const payload = {
    name: formData.name.trim(),
    price: Number(formData.price),
    status: formData.status
  }

  if (editingId.value) {
    await productApi.update(editingId.value, payload)
  } else {
    await productApi.create(payload)
  }

  resetForm()
  await refresh()
}, {
  successText: editingId.value ? 'Updated' : 'Created',
  validate: async () => (await validate()).valid
})

function editRecord(record) {
  editingId.value = record.id
  formData.name = record.name
  formData.price = String(record.price)
  formData.status = record.status
}

async function deleteRecord(id) {
  await runWithLogin(async () => {
    await productApi.remove(id)
    emit('product:changed', { type: 'delete', id })
    if (editingId.value === id) {
      resetForm()
      resetDetail()
    }
    await refresh()
  })
}

function resetForm() {
  editingId.value = 0
  formData.name = ''
  formData.price = ''
  formData.status = 1
}
</script>
```

## Recommended Structure

1. List uses `usePaging`.
2. Detail uses `useRequest`.
3. Create and update share one form and use `useSubmit`.
4. Delete uses the raw API method, then refreshes the list.
5. Edit mode is controlled by `editingId`.
6. Protected actions can be wrapped by `useLoginGuard`.
7. Cross-page refresh can be triggered by emitter events.
8. Form validation can be centralized through `validator.js`.
9. `useForm` can manage error state for larger forms.

## Suggested Optimizations

1. Add a confirmation modal before delete.
2. Extract the form into a reusable component when multiple pages share it.
3. Put validation rules into a separate `rules` object when forms become larger.
4. Use `dictStore` to render status labels instead of hard-coded text.
5. Subscribe to emitter events in list pages that need external refresh.

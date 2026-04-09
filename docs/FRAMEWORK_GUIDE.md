# Framework Guide

This project now includes a reusable framework layer for cache, router, hooks, and base stores.

## 1. Router

File: `@/utils/router.js`

```js
import { go, push, replace, switchTab, back, toLogin, withLogin } from '@/utils'

go('/pages/user/profile', { id: 1 })
push('/pages/order/detail', { id: 1001 })
replace('/pages/login/login')
switchTab('/pages/index/index')
back(1, { refresh: true })
toLogin()

withLogin(() => {
  go('/pages/order/list')
})
```

## 2. Cache

File: `@/utils/cache.js`

```js
import { setCache, getCache, removeCache, clearCache } from '@/utils'

setCache('user:city', 'Shanghai', 60 * 60 * 1000)

const city = getCache('user:city', '')

removeCache('user:city')
clearCache('user:')
```

## 3. useRequest

File: `@/hooks/useRequest.js`

```js
import { useRequest } from '@/hooks'
import { userApi } from '@/api'

const {
  loading,
  data,
  error,
  runAsync,
  refresh,
  reset
} = useRequest(() => userApi.getUserInfo(), {
  defaultValue: null,
  onSuccess: (result) => {
    console.log('loaded', result)
  }
})

await runAsync()
```

## 4. useSubmit

File: `@/hooks/useSubmit.js`

```js
import { reactive } from 'vue'
import { useSubmit } from '@/hooks'
import { userApi } from '@/api'

const formData = reactive({
  nickname: ''
})

const { submitting, submitAsync } = useSubmit(
  () => userApi.updateUserInfo(formData),
  {
    successText: 'Saved',
    validate: () => !!formData.nickname
  }
)

await submitAsync()
```

## 5. usePaging

File: `@/hooks/usePaging.js`

```js
import { usePaging } from '@/hooks'
import { productApi } from '@/api'

const {
  list,
  loading,
  refreshing,
  loadingMore,
  finished,
  search,
  refresh,
  loadMore
} = usePaging((params) => productApi.getList(params), {
  immediate: true,
  initialQuery: {
    keyword: ''
  }
})

search({ keyword: 'phone' })
```

## 6. Config Store

File: `@/store/modules/config.js`

```js
import { useConfigStore } from '@/store'

const configStore = useConfigStore()

configStore.initConfig({
  currentCity: 'Shanghai',
  remoteConfig: {
    enableCoupon: true
  }
})

configStore.setCurrentCity('Hangzhou')
console.log(configStore.settings)
```

## 7. Dict Store

File: `@/store/modules/dict.js`

```js
import { useDictStore } from '@/store'

const dictStore = useDictStore()

dictStore.setDict('status', [
  { label: 'Disabled', value: 0 },
  { label: 'Enabled', value: 1 }
])

const label = dictStore.getDictLabel('status', 1)
const list = dictStore.getDictList('status')
```

## 8. Full CRUD Example

File: `docs/CRUD_EXAMPLE.md`

This includes a complete example for:

1. List with `usePaging`
2. Detail with `useRequest`
3. Create and update with `useSubmit`
4. Delete with API + refresh flow

## 9. Login Guard

File: `@/hooks/useLoginGuard.js`

```js
import { useLoginGuard } from '@/hooks'

const { checkLogin, runWithLogin } = useLoginGuard()

checkLogin()

runWithLogin(() => {
  console.log('run protected action')
})
```

## 10. Event Emitter

File: `@/utils/emitter.js`

```js
import { on, off, once, emit } from '@/utils'

const stop = on('product:refresh', () => {
  console.log('refresh product list')
})

emit('product:refresh')
once('order:paid', () => console.log('paid'))
stop()
off('order:paid')
```

## 11. Platform

File: `@/utils/platform.js`

```js
import { getPlatform, getPlatformLabel, isApp, isH5, isMpWeixin } from '@/utils'

const platform = getPlatform()
const label = getPlatformLabel()
const isAppEnv = isApp()
const isH5Env = isH5()
const isWechatMp = isMpWeixin()
```

## 12. Device

File: `@/utils/device.js`

```js
import { getDeviceInfo, getNavbarHeight, getSafeAreaInsets, getWindowSize } from '@/utils'

const deviceInfo = getDeviceInfo()
const navbarHeight = getNavbarHeight()
const safeArea = getSafeAreaInsets()
const windowSize = getWindowSize()
```

## 13. Modal

File: `@/utils/modal.js`

```js
import { showAlert, showConfirm, showActionSheet } from '@/utils'

await showAlert('Saved')

const confirmed = await showConfirm({
  title: 'Delete',
  content: 'Confirm delete this record?'
})

const index = await showActionSheet({
  itemList: ['Edit', 'Delete']
})
```

## 14. Validator

File: `@/utils/validator.js`

```js
import {
  createRule,
  isPositiveNumber,
  isRequired,
  minLength,
  validateForm
} from '@/utils'

const formData = {
  name: 'Apple',
  price: '12.5'
}

const result = validateForm(formData, {
  name: [
    createRule(isRequired, 'Name is required'),
    createRule((value) => minLength(value, 2), 'At least 2 characters')
  ],
  price: [
    createRule(isRequired, 'Price is required'),
    createRule(isPositiveNumber, 'Price must be greater than 0')
  ]
})
```

## 15. Enhanced usePaging

`usePaging` now supports:

1. `emptyText`
2. `errorMessage`
3. `retry`
4. `onRefresh`
5. `onLoadMore`
6. `onSuccess`
7. `onError`

## 16. useForm

File: `@/hooks/useForm.js`

```js
import { useForm } from '@/hooks'
import { createRule, isPositiveNumber, isRequired } from '@/utils'

const {
  model,
  errors,
  validate,
  validateField,
  reset
} = useForm({
  name: '',
  price: ''
}, {
  name: [
    createRule(isRequired, 'Name is required')
  ],
  price: [
    createRule(isRequired, 'Price is required'),
    createRule(isPositiveNumber, 'Price must be greater than 0')
  ]
})

await validate()
validateField('name')
reset()
```

## Suggested Next Upgrades

1. Add a dict API wrapper so `dictStore.fetchDict` can call a fixed backend service directly.
2. Add a request mock adapter for demo pages and offline development.
3. Connect the new demo pages into `pages.json` and the homepage demo list.
4. Add a unified table/list toolbar component for search, reset, and filters.
5. Add a reusable empty/error state component that works directly with `usePaging`.

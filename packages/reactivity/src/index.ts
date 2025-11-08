import { isObject } from '@vue/shared'

function fn(a, b) {
  return a + b + 2
}
isObject({})

export { fn }

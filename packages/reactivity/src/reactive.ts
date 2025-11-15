import { isObject } from '@vue/shared'

export function reactive<T extends object>(target: T) {
  return createReactiveObject(target)
}
function createReactiveObject<T extends object>(target: T) {
  if (!isObject(target)) {
    return target
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {},
    set(target, key, value, receiver) {},
  })
}

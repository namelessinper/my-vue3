import { activeSub } from './effect'
import { link, propagate, Link } from './system'

enum ReactivityFlags {
  IS_REF = '__v_isRef',
}

export class RefImpl {
  _value;

  [ReactivityFlags.IS_REF] = true

  subs: Link
  subsTail: Link
  constructor(value: any) {
    this._value = value
  }

  get value() {
    trackRef(this)

    return this._value
  }

  set value(newValue: any) {
    this._value = newValue
    trigerRef(this)
  }
}

export function ref(value: any) {
  return new RefImpl(value)
}

export function isRef(value: any): boolean {
  return !!(value && value[ReactivityFlags.IS_REF])
}

export function trackRef(dep: RefImpl) {
  if (activeSub) {
    link(dep, activeSub)
  }
}

export function trigerRef(dep: RefImpl) {
  if (dep.subs) {
    propagate(dep.subs)
  }
}

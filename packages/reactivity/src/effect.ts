import { Link } from './system'

export let activeSub

export class ReactiveEffect {
  deps: Link | undefined
  depsTail: Link | undefined

  constructor(public fn: Function) {}
  run() {
    const prevSub = activeSub
    activeSub = this
    this.depsTail = undefined
    try {
      return this.fn()
    } finally {
      activeSub = prevSub
    }
  }

  scheduler() {
    this.run()
  }
  notify() {
    this.scheduler()
  }
}

export function effect(fn: Function, options?: any) {
  debugger
  const e = new ReactiveEffect(fn)
  Object.assign(e, options)
  e.run()

  const runner = () => e.run()
  runner.effect = e
  return runner
}

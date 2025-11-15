import { endTrack, Link, startTrack } from './system'

export let activeSub

export class ReactiveEffect {
  deps: Link | undefined
  depsTail: Link | undefined
  tracking = false
  constructor(public fn: Function) {}
  run() {
    const prevSub = activeSub
    activeSub = this
    startTrack(this)
    try {
      return this.fn()
    } finally {
      endTrack(this)
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
  const e = new ReactiveEffect(fn)
  Object.assign(e, options)
  e.run()

  const runner = () => e.run()
  runner.effect = e
  return runner
}
